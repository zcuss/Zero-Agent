import { NextResponse } from "next/server";
import {
  validateApiKey,
  upsertAuthSession,
  getAuthSession,
  deleteAuthSession,
  getProviderConnections,
  createProviderConnection,
  updateProviderConnection,
} from "@/lib/localDb";

export const dynamic = "force-dynamic";

function getApiToken(req) {
  const h = req.headers;
  // API token is separate from OAuth access token.
  // Only read API token from dedicated headers.
  return (h.get("x-api-key") || h.get("x-api-token") || "").trim();
}

async function requireValidApiKey(token) {
  if (!token) return { ok: false, res: NextResponse.json({ error: "Missing API token" }, { status: 401 }) };

  const ok = await validateApiKey(token);
  if (!ok) return { ok: false, res: NextResponse.json({ error: "Invalid API token" }, { status: 403 }) };

  return { ok: true };
}

function decodeJwtPayload(jwt) {
  try {
    const parts = String(jwt || "").split(".");
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : "";
    const json = Buffer.from(b64 + pad, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function coerceToImportItems(input) {
  // Selaras dengan Cockpit: token bisa berupa string, JSON object, JSON array.
  // Return array of objects.
  if (input === null || input === undefined) return [{}];
  if (typeof input === "string") {
    const raw = input.trim();
    if (!raw) return [{}];

    // Try parse JSON first
    if (raw.startsWith("{") || raw.startsWith("[")) {
      try {
        const parsed = JSON.parse(raw);
        return coerceToImportItems(parsed);
      } catch {
        // fallthrough as token lines
      }
    }

    // Token lines: bisa multi-line. Ambil semua kandidat JWT.
    const lines = raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    const jwtLike = lines.filter((s) => s.split(".").length >= 2);
    if (jwtLike.length) return jwtLike.map((t) => ({ accessToken: t }));

    return [{ accessToken: raw }];
  }

  if (Array.isArray(input)) {
    return input.flatMap((x) => coerceToImportItems(x));
  }

  if (typeof input === "object") {
    // Cockpit auth-file: { tokens: {...} }
    if (input.tokens && typeof input.tokens === "object") return [input.tokens];

    // beberapa variasi key
    if (typeof input.token === "string" && !input.accessToken) return [{ ...input, accessToken: input.token }];

    return [input];
  }

  return [{}];
}

function pickFirstTokenLike(input) {
  const raw = String(input || "").trim();
  if (!raw) return "";
  const lines = raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  const candidate = lines.find((s) => s.split(".").length >= 2);
  return candidate || raw;
}

function normalizeSessionInput(oneInput) {
  const now = new Date().toISOString();
  let body = oneInput;

  const wrappedSession = typeof body?.session_json === "string" ? body.session_json : null;
  if (wrappedSession) {
    try {
      body = JSON.parse(wrappedSession);
    } catch {
      // ignore
    }
  }

  const account = body?.account && typeof body.account === "object" ? body.account : {};
  const user = body?.user && typeof body.user === "object" ? body.user : {};
  const credentials = body?.credentials && typeof body.credentials === "object" ? body.credentials : {};
  const tokensObj = body?.tokens && typeof body.tokens === "object" ? body.tokens : {};

  const accessToken = pickFirstTokenLike(
    body?.accessToken ||
      body?.sessionToken ||
      body?.access_token ||
      body?.token ||
      tokensObj?.accessToken ||
      tokensObj?.access_token ||
      credentials?.access_token
  );

  const refreshToken = String(
    body?.refreshToken ||
      body?.refresh_token ||
      tokensObj?.refreshToken ||
      tokensObj?.refresh_token ||
      credentials?.refresh_token ||
      ""
  ).trim() || null;

  const jwtPayload = accessToken ? decodeJwtPayload(accessToken) : null;
  const jwtProfile = jwtPayload?.["https://api.openai.com/profile"] || {};
  const jwtAuth = jwtPayload?.["https://api.openai.com/auth"] || {};

  const providerSpecificData = body?.providerSpecificData && typeof body.providerSpecificData === "object"
    ? body.providerSpecificData
    : {
        chatgptAccountId: body?.chatgptAccountId || jwtAuth.chatgpt_account_id || account.id || null,
        chatgptPlanType: body?.chatgptPlanType || jwtAuth.chatgpt_plan_type || account.planType || null,
      };

  const expiresAtRaw = body?.expiresAt || body?.expires;
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null;

  const out = {
    accessToken,
    refreshToken,
    expiresAt,
    testStatus: body?.testStatus ?? "active",
    expiresIn: Number.isFinite(Number(body?.expiresIn)) ? Number(body.expiresIn) : 864000,
    providerSpecificData,
    lastUsedAt: body?.lastUsedAt ? new Date(body.lastUsedAt).toISOString() : now,
    consecutiveUseCount: Number.isFinite(Number(body?.consecutiveUseCount)) ? Number(body.consecutiveUseCount) : 1,
    errorCode: body?.errorCode ?? 0,
    backoffLevel: Number.isFinite(Number(body?.backoffLevel)) ? Number(body.backoffLevel) : 0,
    "modelLock_gpt-5-codex": body?.["modelLock_gpt-5-codex"] ?? null,
    "modelLock_gpt-5.3-codex": body?.["modelLock_gpt-5.3-codex"] ?? null,
    "modelLock_gpt-5.5": body?.["modelLock_gpt-5.5"] ?? null,
    lastError: body?.lastError ?? null,
    lastErrorAt: body?.lastErrorAt ? new Date(body.lastErrorAt).toISOString() : null,
  };

  for (const [k, v] of Object.entries(body || {})) {
    if (!k.startsWith("modelLock_")) continue;
    out[k] = v === null ? null : new Date(v).toISOString();
  }

  const email = body?.email || user.email || jwtProfile.email || null;

  return {
    session: out,
    profile: {
      id: account.id || providerSpecificData.chatgptAccountId || null,
      email,
      name: body?.name || user.name || email || null,
      planType: account.planType || providerSpecificData.chatgptPlanType || null,
    },
  };
}

async function upsertCodexProviderConnection(session, profile, authType = "oauth") {
  const provider = "codex";
  const email = profile.email || profile.name || "codex-session";
  const id = profile.id;
  const existingList = await getProviderConnections({ provider });
  const existing = existingList.find((c) => {
    const sameId = id && c.providerSpecificData?.chatgptAccountId === id;
    const sameEmail = email && c.email === email;
    return c.authType === authType && (sameId || sameEmail);
  });

  const payload = {
    provider,
    authType,
    name: email,
    email,
    isActive: true,
    ...session,
    providerSpecificData: {
      ...(session.providerSpecificData || {}),
      authMethod: authType === "access_token" ? "access_token" : "oauth",
    },
  };

  if (existing) return updateProviderConnection(existing.id, payload);
  return createProviderConnection(payload);
}

// GET /api/auth/session?provider=chatgpt
export async function GET(req) {
  const token = getApiToken(req);
  const check = await requireValidApiKey(token);
  if (!check.ok) return check.res;

  const { searchParams } = new URL(req.url);
  const provider = (searchParams.get("provider") || "").trim() || undefined;

  const session = await getAuthSession(token, provider);
  return NextResponse.json({ session });
}

// PUT /api/auth/session?provider=chatgpt  (upsert)
export async function PUT(req) {
  const token = getApiToken(req);

  if (token) {
    const check = await requireValidApiKey(token);
    if (!check.ok) return check.res;
  }

  const { searchParams } = new URL(req.url);
  const provider = (searchParams.get("provider") || "").trim() || "codex";

  const rawText = await req.text().catch(() => "");
  let parsedBody = rawText;
  if (rawText.trim().startsWith("{") || rawText.trim().startsWith("[")) {
    try {
      parsedBody = JSON.parse(rawText);
    } catch {
      parsedBody = rawText;
    }
  }

  const items = coerceToImportItems(parsedBody);

  const imported = [];
  for (const item of items) {
    const normalized = normalizeSessionInput(item);
    if (!normalized.session.accessToken) continue;

    const hasRefresh = !!String(normalized.session.refreshToken || "").trim();
    const authType = hasRefresh ? "oauth" : "access_token";

    const saved = token ? await upsertAuthSession(token, provider, normalized.session) : null;
    const connection = await upsertCodexProviderConnection(normalized.session, normalized.profile, authType);
    imported.push({ session: saved, connection });
  }

  if (!imported.length) {
    return NextResponse.json({ error: "No valid access token found in payload" }, { status: 400 });
  }

  return NextResponse.json({
    session: imported[0].session,
    connection: imported[0].connection,
    importedCount: imported.length,
    imported,
  });
}

// DELETE /api/auth/session?provider=chatgpt
export async function DELETE(req) {
  const token = getApiToken(req);
  const check = await requireValidApiKey(token);
  if (!check.ok) return check.res;

  const { searchParams } = new URL(req.url);
  const provider = (searchParams.get("provider") || "").trim() || undefined;

  const ok = await deleteAuthSession(token, provider);
  return NextResponse.json({ ok });
}
