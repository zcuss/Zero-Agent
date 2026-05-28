import { createHash, randomUUID } from "crypto";
import { BaseExecutor } from "../../shared/base.js";
import { CODEX_DEFAULT_INSTRUCTIONS } from "../../../config/codexInstructions.js";
import { PROVIDERS } from "../../../config/providers.js";
import { normalizeResponsesInput } from "../../../translator/helpers/responsesApiHelper.js";
import { fetchImageAsBase64 } from "../../../translator/helpers/imageHelper.js";
import { getModelUpstreamId } from "../../../config/providerModels.js";
import { getConsistentMachineId } from "../../../../src/shared/utils/machineId.js";
import { DEFAULT_RETRY_CONFIG, resolveRetryEntry } from "../../../config/runtimeConfig.js";
import { dbg } from "../../../utils/debugLog.js";

// SSE error patterns inside 200-OK body that should trigger retry as if 503
const CODEX_SSE_OVERLOADED_PATTERNS = ["server_is_overloaded", "service_unavailable_error"];
const CODEX_SSE_PEEK_BYTES = 4096;
const CODEX_ORIGINATOR = "codex_cli_rs";
const CODEX_USER_AGENT = "codex-imagen/0.2.6";
const CODEX_VERSION = "0.129.0";

// In-memory map: hash(machineId + first assistant content) â†’ { sessionId, lastUsed }
const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour
const assistantSessionMap = new Map();

// Server-generated item id prefixes that Codex /responses cannot resolve when store=false
const SERVER_ID_PATTERN = /^(rs|fc|resp|msg)_/;

// Hosted tool types that Codex/OpenAI Responses executes server-side
const CODEX_HOSTED_TOOL_TYPES = new Set([
  "image_generation", "web_search", "web_search_preview", "file_search",
  "computer", "computer_use_preview", "code_interpreter", "mcp", "local_shell"
]);

// Allowlist of fields accepted by Codex Responses API â€” anything else is stripped
const RESPONSES_API_ALLOWLIST = new Set([
  "model", "input", "instructions", "tools", "tool_choice", "stream", "store",
  "reasoning", "service_tier", "include", "prompt_cache_key", "client_metadata"
]);

// Convert role=system â†’ role=developer in body.input (keeps content in cacheable prefix)
function convertSystemToDeveloperRole(body) {
  if (!Array.isArray(body.input)) return;
  for (const item of body.input) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const isSystemMsg = item.role === "system" && (!item.type || item.type === "message");
    if (isSystemMsg) item.role = "developer";
  }
}

// Strip server-generated item IDs (rs_/fc_/resp_/msg_) from input â€” avoids 404 with store=false
function stripStoredItemReferences(body) {
  if (!Array.isArray(body.input)) return;
  body.input = body.input.filter((item) => {
    if (typeof item === "string" && SERVER_ID_PATTERN.test(item)) return false;
    if (item && typeof item === "object" && !Array.isArray(item)) {
      if (item.type === "item_reference") return false;
      if (typeof item.id === "string" && SERVER_ID_PATTERN.test(item.id)) delete item.id;
    }
    return true;
  });
}

// Flatten Chat-Completions tool shape into Responses flat format + filter unsupported tools
function normalizeCodexTools(body) {
  if (!Array.isArray(body.tools)) return;
  const validNames = new Set();
  body.tools = body.tools.filter((tool) => {
    if (!tool || typeof tool !== "object" || Array.isArray(tool)) return false;
    const type = typeof tool.type === "string" ? tool.type : "";
    if (type === "namespace") {
      if (Array.isArray(tool.tools)) {
        for (const st of tool.tools) {
          const n = typeof st?.name === "string" ? st.name.trim().slice(0, 128) : "";
          if (n) validNames.add(n);
        }
      }
      return true;
    }
    if (type !== "function") {
      if (!type || tool.function || typeof tool.name === "string") return false;
      return CODEX_HOSTED_TOOL_TYPES.has(type);
    }
    const fn = tool.function && typeof tool.function === "object" && !Array.isArray(tool.function) ? tool.function : null;
    const rawName = typeof tool.name === "string" ? tool.name : (typeof fn?.name === "string" ? fn.name : "");
    const name = rawName.trim();
    if (!name) return false;
    const description = typeof tool.description === "string" ? tool.description : (typeof fn?.description === "string" ? fn.description : "");
    const parameters = (tool.parameters && typeof tool.parameters === "object" && !Array.isArray(tool.parameters))
      ? tool.parameters
      : (fn?.parameters && typeof fn.parameters === "object" && !Array.isArray(fn.parameters) ? fn.parameters : { type: "object", properties: {} });
    for (const k of Object.keys(tool)) delete tool[k];
    tool.type = "function";
    tool.name = name.slice(0, 128);
    if (description) tool.description = description;
    tool.parameters = parameters;
    validNames.add(name);
    return true;
  });
  // Drop tool_choice if it references an unknown function name
  if (body.tool_choice && typeof body.tool_choice === "object" && !Array.isArray(body.tool_choice)) {
    if (body.tool_choice.type === "function") {
      const n = typeof body.tool_choice.name === "string" ? body.tool_choice.name.trim() : "";
      if (!n || !validNames.has(n)) delete body.tool_choice;
    }
  }
}

// Cache machine ID at module level (resolved once)
let cachedMachineId = null;
getConsistentMachineId().then(id => { cachedMachineId = id; });

function hashContent(text) {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

function generateSessionId() {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function decodeJwtPayload(jwt) {
  try {
    const parts = String(jwt || "").split(".");
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = (4 - (b64.length % 4)) % 4;
    return JSON.parse(Buffer.from(b64 + "=".repeat(pad), "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function extractChatGptAccountIdFromToken(token) {
  const payload = decodeJwtPayload(token);
  return payload?.["https://api.openai.com/auth"]?.chatgpt_account_id || null;
}

function getTokenDiagnostics(token) {
  const payload = decodeJwtPayload(token) || {};
  const authClaim = payload?.["https://api.openai.com/auth"] || {};
  const exp = Number(payload?.exp || 0);
  const nowSec = Math.floor(Date.now() / 1000);
  const ttlSec = exp > 0 ? (exp - nowSec) : null;
  return {
    iss: typeof payload?.iss === "string" ? payload.iss : "none",
    audType: Array.isArray(payload?.aud) ? "array" : typeof payload?.aud,
    hasAuthClaim: !!authClaim && typeof authClaim === "object",
    hasAccountId: !!authClaim?.chatgpt_account_id,
    hasWorkspaceId: !!authClaim?.workspace_id,
    exp,
    ttlSec,
    expired: ttlSec !== null ? ttlSec <= 0 : null,
  };
}

// Extract text content from an input item
function extractItemText(item) {
  if (!item) return "";
  if (typeof item.content === "string") return item.content;
  if (Array.isArray(item.content)) {
    return item.content.map(c => c.text || c.output || "").filter(Boolean).join("");
  }
  return "";
}

// Normalize a session id candidate (trim, length cap)
function normalizeSessionId(value) {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v || v.length > 256) return null;
  return v;
}

// Resolve prompt-cache session id with priority: body → assistant-text-hash → accountId → machineId
function resolveCacheSessionId(body, credentials, machineId) {
  // 1. Client-provided session/conversation id (highest priority — stable per conversation)
  const fromBody =
    normalizeSessionId(body?.prompt_cache_key) ||
    normalizeSessionId(body?.session_id) ||
    normalizeSessionId(body?.conversation_id);
  if (fromBody) return fromBody;

  // 2. Hash accumulated assistant text (≥50 chars) — sticky session across turns
  if (Array.isArray(body?.input) && body.input.length > 0) {
    let text = "";
    const MIN_LEN = 50;
    const CAP_LEN = 200;
    for (const item of body.input) {
      if (item?.role !== "assistant") continue;
      const t = extractItemText(item);
      if (!t) continue;
      text += t;
      if (text.length >= CAP_LEN) break;
    }
    if (text.length >= MIN_LEN) {
      const hash = hashContent((machineId || "") + text.slice(0, CAP_LEN));
      const entry = assistantSessionMap.get(hash);
      if (entry) {
        entry.lastUsed = Date.now();
        return entry.sessionId;
      }
      const sessionId = generateSessionId();
      assistantSessionMap.set(hash, { sessionId, lastUsed: Date.now() });
      return sessionId;
    }
  }

  // 3. Account-wide fallback (ChatGPT account/workspace id from connection)
  const accountId = normalizeSessionId(
    credentials?.providerSpecificData?.chatgptAccountId ||
    credentials?.providerSpecificData?.workspaceId
  );
  if (accountId) return accountId;

  // 4. Last resort — stable per-machine id
  return machineId ? `sess_${hashContent(machineId)}` : generateSessionId();
}

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of assistantSessionMap) {
    if (now - entry.lastUsed > SESSION_TTL_MS) assistantSessionMap.delete(key);
  }
}, 10 * 60 * 1000);

/**
 * Codex Executor - handles OpenAI Codex API (Responses API format)
 * Automatically injects default instructions if missing
 */
export class CodexExecutor extends BaseExecutor {
  constructor() {
    super("codex", PROVIDERS.codex);
    this._currentSessionId = null;
  }

  /**
   * Override headers to add codex-specific identity headers.
   * transformRequest runs BEFORE buildHeaders, sets this._currentSessionId.
   */
  buildHeaders(credentials, stream = true) {
    const headers = super.buildHeaders(credentials, stream);
    const requestId = randomUUID();
    const token = credentials?.accessToken || credentials?.apiKey || "";

    // Cockpit-style Codex headers: mirror the working Codex image provider flow.
    headers["Accept"] = "text/event-stream, application/json";
    headers["Content-Type"] = "application/json";

    // Optional: override dari bundle (hasil import Cockpit) supaya benar-benar identik.
    const bundle = credentials?.providerSpecificData?.codexAuthBundle || null;

    headers["originator"] = (typeof bundle?.originator === "string" && bundle.originator) ? bundle.originator : CODEX_ORIGINATOR;
    headers["User-Agent"] = (typeof bundle?.userAgent === "string" && bundle.userAgent) ? bundle.userAgent : CODEX_USER_AGENT;
    headers["version"] = (typeof bundle?.version === "string" && bundle.version) ? bundle.version : CODEX_VERSION;

    headers["x-client-request-id"] = (typeof bundle?.x_client_request_id === "string" && bundle.x_client_request_id)
      ? bundle.x_client_request_id
      : requestId;

    headers["session_id"] = (typeof bundle?.session_id === "string" && bundle.session_id)
      ? bundle.session_id
      : (this._currentSessionId || requestId);

    // Cookie / CF binding (kalau Cockpit menyertakan). Ini sering jadi pembeda 401.
    if (typeof bundle?.cookie === "string" && bundle.cookie.trim() !== "") {
      headers["Cookie"] = bundle.cookie.trim();
    }
    if (typeof bundle?.cf_clearance === "string" && bundle.cf_clearance.trim() !== "") {
      // Kalau cookie tidak diberikan tapi cf_clearance diberikan, tetap kirim sebagai cookie.
      if (!headers["Cookie"]) headers["Cookie"] = `cf_clearance=${bundle.cf_clearance.trim()}`;
    }
    if (typeof bundle?.oai_device_id === "string" && bundle.oai_device_id.trim() !== "") {
      headers["oai-device-id"] = bundle.oai_device_id.trim();
    }

    // Workspace/account binding header — use stored account first, then decode token claim.
    const accountId =
      credentials?.providerSpecificData?.chatgptAccountId ||
      credentials?.providerSpecificData?.workspaceId ||
      extractChatGptAccountIdFromToken(token);
    if (typeof accountId === "string" && accountId) {
      headers["chatgpt-account-id"] = accountId;
    }

    const tokenPrefix = typeof token === "string" ? token.slice(0, 12) : "";
    const tokenFp = tokenPrefix ? hashContent(tokenPrefix) : "none";
    const td = getTokenDiagnostics(token);
    dbg(
      "CODEX_AUTH",
      `conn=${credentials?.connectionId || "unknown"} auth=${credentials?.authType || credentials?.providerSpecificData?.authMethod || "unknown"} tokenLen=${typeof token === "string" ? token.length : 0} tokenFp=${tokenFp} acct=${typeof accountId === "string" && accountId ? accountId : "none"} originator=${headers["originator"]} ua=${headers["User-Agent"]} hasAuthHeader=${!!headers["Authorization"]} hasCookie=${!!headers["Cookie"]} hasDevice=${!!headers["oai-device-id"]} hasBundle=${!!bundle} hasBundleCookie=${!!bundle?.cookie} hasBundleDevice=${!!bundle?.oai_device_id} hasBundleSession=${!!bundle?.session_id} iss=${td.iss} audType=${td.audType} hasAuthClaim=${td.hasAuthClaim} hasAccountId=${td.hasAccountId} hasWorkspaceId=${td.hasWorkspaceId} exp=${td.exp || 0} ttlSec=${td.ttlSec ?? "none"} expired=${td.expired}`
    );

    return headers;
  }

  buildUrl(model, stream, urlIndex = 0, credentials = null) {
    const base = super.buildUrl(model, stream, urlIndex, credentials);
    return this._isCompact ? `${base}/compact` : base;
  }

  /**
   * Prefetch remote image URLs and inline them as base64 data URIs.
   * Runs before execute() because Codex backend cannot fetch remote images.
   * Mutates body.input in place.
   */
  async prefetchImages(body) {
    if (!Array.isArray(body?.input)) return;
    for (const item of body.input) {
      if (!Array.isArray(item.content)) continue;
      const pending = item.content.map(async (c) => {
        if (c.type !== "image_url") return c;
        const url = typeof c.image_url === "string" ? c.image_url : c.image_url?.url;
        const detail = c.image_url?.detail || "auto";
        if (!url) return c;
        if (url.startsWith("data:")) return { type: "input_image", image_url: url, detail };
        const fetched = await fetchImageAsBase64(url, { timeoutMs: 15000 });
        return { type: "input_image", image_url: fetched?.url || url, detail };
      });
      item.content = await Promise.all(pending);
    }
  }

  async execute(args) {
    const imgCount = Array.isArray(args.body?.input) ? args.body.input.reduce((n, it) => n + (Array.isArray(it.content) ? it.content.filter(c => c.type === "image_url").length : 0), 0) : 0;
    const inputLen = Array.isArray(args.body?.input) ? args.body.input.length : 0;
    dbg("CODEX", `execute start | inputItems=${inputLen} | images=${imgCount} | sessionId=${this._currentSessionId || "pending"}`);
    if (imgCount > 0) {
      const t0 = Date.now();
      await this.prefetchImages(args.body);
      dbg("CODEX", `prefetchImages done | ${Date.now() - t0}ms`);
    } else {
      await this.prefetchImages(args.body);
    }

    // Retry loop for SSE-level overloaded errors (200 OK body contains event: error)
    // Reuses 503 retry config â€” same semantic: upstream temporarily unavailable
    const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...this.config.retry };
    const { attempts, delayMs } = resolveRetryEntry(retryConfig[503]);
    let attempt = 0;
    while (true) {
      const result = await super.execute(args);
      const peek = await this._peekSseOverloaded(result.response);
      if (!peek.matched) {
        // Replace body with re-assembled stream (prefix bytes already read + rest)
        if (peek.replacementBody) {
          result.response = new Response(peek.replacementBody, {
            status: result.response.status,
            statusText: result.response.statusText,
            headers: result.response.headers,
          });
        }
        return result;
      }
      if (attempt >= attempts) {
        args.log?.warn?.("RETRY", `CODEX | SSE overloaded "${peek.matched}" â€” retries exhausted (${attempt}/${attempts})`);
        // Out of retries â†’ return with replacement body so client gets the error
        if (peek.replacementBody) {
          result.response = new Response(peek.replacementBody, {
            status: result.response.status,
            statusText: result.response.statusText,
            headers: result.response.headers,
          });
        }
        return result;
      }
      attempt++;
      args.log?.debug?.("RETRY", `CODEX | SSE "${peek.matched}" retry ${attempt}/${attempts} after ${delayMs / 1000}s`);
      dbg("CODEX", `SSE overloaded "${peek.matched}" â†’ retry ${attempt}/${attempts} in ${delayMs}ms`);
      try { await result.response.body?.cancel?.(); } catch { /* noop */ }
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  // Peek first N bytes of SSE body to detect upstream "overloaded" errors.
  // Returns { matched: string|null, replacementBody: ReadableStream|null }.
  // Caller MUST use replacementBody (original body has been read).
  async _peekSseOverloaded(response) {
    if (!response || !response.ok || !response.body) return { matched: null, replacementBody: null };
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const chunks = [];
    let text = "";
    let matched = null;
    try {
      while (text.length < CODEX_SSE_PEEK_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        text += decoder.decode(value, { stream: true });
        const hit = CODEX_SSE_OVERLOADED_PATTERNS.find(p => text.includes(p));
        if (hit) { matched = hit; break; }
      }
    } catch (e) {
      dbg("CODEX", `peek read error: ${e.message}`);
    }
    reader.releaseLock();

    // Re-assemble stream: prefix chunks + remaining upstream body
    const upstream = response.body;
    let upstreamReader = null;
    const replacementBody = new ReadableStream({
      start(controller) {
        for (const c of chunks) controller.enqueue(c);
        upstreamReader = upstream.getReader();
      },
      async pull(controller) {
        try {
          const { done, value } = await upstreamReader.read();
          if (done) { controller.close(); return; }
          controller.enqueue(value);
        } catch (e) { controller.error(e); }
      },
      cancel(reason) {
        try { upstreamReader?.cancel(reason); } catch { /* noop */ }
      },
    });
    return { matched, replacementBody };
  }

  // Parse Codex usage_limit_reached to extract precise resetsAtMs; fallback to default otherwise
  parseError(response, bodyText) {
    if (response.status === 429 && bodyText) {
      try {
        const json = JSON.parse(bodyText);
        const err = json?.error;
        if (err?.type === "usage_limit_reached") {
          const now = Date.now();
          let resetsAtMs = null;
          if (typeof err.resets_at === "number" && err.resets_at > 0) {
            const ms = err.resets_at * 1000;
            if (ms > now) resetsAtMs = ms;
          }
          if (!resetsAtMs && typeof err.resets_in_seconds === "number" && err.resets_in_seconds > 0) {
            resetsAtMs = now + err.resets_in_seconds * 1000;
          }
          if (resetsAtMs) {
            return { status: 429, message: err.message || bodyText, resetsAtMs };
          }
        }
      } catch { /* fall through to default */ }
    }
    return super.parseError(response, bodyText);
  }

  /**
   * Transform request before sending - inject default instructions if missing.
   * Image fetching is handled separately in prefetchImages() so this stays sync.
   */
  transformRequest(model, body, stream, credentials) {
    this._isCompact = !!body._compact;
    delete body._compact;
    // Resolve conversation-stable session_id (priority: body â†’ assistant-text â†’ workspace â†’ machine)
    this._currentSessionId = resolveCacheSessionId(body, credentials, cachedMachineId);
    // Convert string input to array format (Codex API requires input as array)
    const normalized = normalizeResponsesInput(body.input);
    if (normalized) body.input = normalized;

    // Ensure input is present and non-empty (Codex API rejects empty input)
    if (!body.input || (Array.isArray(body.input) && body.input.length === 0)) {
      body.input = [{ type: "message", role: "user", content: [{ type: "input_text", text: "..." }] }];
    }

    // Keep system prompts in body.input as role=developer so they stay in the cacheable prefix
    convertSystemToDeveloperRole(body);
    // Strip server-generated item IDs (rs_/fc_/resp_/msg_) â€” Codex /responses can't resolve when store=false
    stripStoredItemReferences(body);
    // Flatten function tools + drop unsupported types
    normalizeCodexTools(body);

    // Ensure streaming is enabled (Codex API requires it)
    body.stream = true;

    // If no instructions provided, inject default Codex instructions
    if (!body.instructions || body.instructions.trim() === "") {
      body.instructions = CODEX_DEFAULT_INSTRUCTIONS;
    }

    // Ensure store is false (Codex requirement)
    body.store = false;

    // Inject prompt_cache_key for stable Codex prompt caching
    if (!body.prompt_cache_key && this._currentSessionId) {
      body.prompt_cache_key = this._currentSessionId;
    }

    // Map virtual Codex review models to the upstream Codex model before suffix parsing.
    body.model = getModelUpstreamId("cx", body.model || model);

    // Extract thinking level from model name suffix
    // e.g., gpt-5.3-codex-high â†’ high, gpt-5.3-codex â†’ medium (default)
    const effortLevels = ['none', 'low', 'medium', 'high', 'xhigh'];
    let modelEffort = null;
    for (const level of effortLevels) {
      if (body.model.endsWith(`-${level}`)) {
        modelEffort = level;
        // Strip suffix from model name for actual API call
        body.model = body.model.replace(`-${level}`, '');
        break;
      }
    }

    // Priority: explicit reasoning.effort > reasoning_effort param > model suffix > default (medium)
    if (!body.reasoning) {
      const effort = body.reasoning_effort || modelEffort || 'low';
      body.reasoning = { effort, summary: "auto" };
    } else if (!body.reasoning.summary) {
      body.reasoning.summary = "auto";
    }
    delete body.reasoning_effort;

    // Include reasoning encrypted content (required by Codex backend for reasoning models)
    if (body.reasoning && body.reasoning.effort && body.reasoning.effort !== 'none') {
      body.include = ["reasoning.encrypted_content"];
    }

    // Remove unsupported parameters for Codex API
    delete body.temperature;
    delete body.top_p;
    delete body.frequency_penalty;
    delete body.presence_penalty;
    delete body.logprobs;
    delete body.top_logprobs;
    delete body.n;
    delete body.seed;
    delete body.max_tokens;
    delete body.max_completion_tokens;
    delete body.max_output_tokens; // Responses API clients send this but Codex rejects it
    delete body.user; // Cursor sends this but Codex doesn't support it
    delete body.prompt_cache_retention; // Cursor sends this but Codex doesn't support it
    delete body.metadata; // Cursor sends this but Codex doesn't support it
    delete body.stream_options; // Cursor sends this but Codex doesn't support it
    delete body.safety_identifier; // Droid CLI sends this but Codex doesn't support it
    delete body.previous_response_id; // store=false â†’ backend can't resolve previous resp; avoid 404

    // Final allowlist filter â€” strip any unknown field that could trigger upstream "routing_unsupported"
    for (const k of Object.keys(body)) {
      if (!RESPONSES_API_ALLOWLIST.has(k)) delete body[k];
    }

    return body;
  }
}

