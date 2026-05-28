import { NextResponse } from "next/server";
import { createProviderConnection } from "@/models";
import { extractCodexAccountInfo } from "@/lib/oauth/providers";

/**
 * POST /api/oauth/codex/import-token
 * Import a ChatGPT access token (created from chatgpt.com settings)
 * as a provider connection, bypassing OAuth refresh flow.
 *
 * Body: { accessToken: string, name?: string }
 */
function findJwtLikeToken(value) {
  if (!value) return "";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed && (trimmed.startsWith("{") || trimmed.startsWith("["))) {
      try {
        const parsed = JSON.parse(trimmed);
        const found = findJwtLikeToken(parsed);
        if (found) return found;
      } catch {
        // fall through to line scan
      }
    }
    return trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line && line.split(".").length >= 2) || trimmed;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findJwtLikeToken(item);
      if (found) return found;
    }
    return "";
  }
  if (typeof value === "object") {
    for (const key of ["accessToken", "access_token", "sessionToken", "session_token", "token", "id_token", "idToken"]) {
      const found = findJwtLikeToken(value[key]);
      if (found) return found;
    }
    for (const nested of Object.values(value)) {
      const found = findJwtLikeToken(nested);
      if (found) return found;
    }
  }
  return "";
}

function pickString(obj, keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (typeof v === "string" && v.trim() !== "") return v.trim();
  }
  return "";
}

function normalizeCookie(raw) {
  if (!raw || typeof raw !== "string") return "";
  // terima raw "name=value; name2=value2" atau multi-line
  return raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean).join("; ");
}

function normalizeCookieFromAny(value) {
  if (!value) return "";
  if (typeof value === "string") return normalizeCookie(value);
  if (Array.isArray(value)) {
    const joined = value
      .map((v) => (typeof v === "string" ? v.split(";")[0].trim() : ""))
      .filter(Boolean)
      .join("; ");
    return normalizeCookie(joined);
  }
  if (typeof value === "object") {
    const pairs = Object.entries(value)
      .map(([k, v]) => {
        if (typeof v !== "string") return "";
        const key = String(k).trim();
        const val = v.trim();
        return key && val ? `${key}=${val}` : "";
      })
      .filter(Boolean)
      .join("; ");
    return normalizeCookie(pairs);
  }
  return "";
}

function extractCodexAuthBundle(payload, accessToken) {
  const obj = payload && typeof payload === "object" ? payload : {};

  // Support kasus umum: user paste JSON Cockpit mentah ke field accessToken (string)
  let nested = {};
  const rawAccessTokenField = typeof obj?.accessToken === "string" ? obj.accessToken.trim() : "";
  if (rawAccessTokenField && (rawAccessTokenField.startsWith("{") || rawAccessTokenField.startsWith("["))) {
    try {
      const parsed = JSON.parse(rawAccessTokenField);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) nested = parsed;
    } catch {
      // ignore malformed nested JSON
    }
  }

  const merged = { ...nested, ...obj };

  const idToken = pickString(merged, ["idToken", "id_token"]);
  const refreshToken = pickString(merged, ["refreshToken", "refresh_token"]);

  const headersObj = merged?.headers && typeof merged.headers === "object" ? merged.headers : {};
  const authBundleObj = merged?.authBundle && typeof merged.authBundle === "object" ? merged.authBundle : {};
  const cockpitObj = merged?.cockpit && typeof merged.cockpit === "object" ? merged.cockpit : {};

  const cookie = normalizeCookieFromAny(
    merged?.cookie ||
    merged?.cookies ||
    merged?.Cookie ||
    merged?.CookieHeader ||
    headersObj?.cookie ||
    headersObj?.Cookie ||
    headersObj?.["set-cookie"] ||
    authBundleObj?.cookie ||
    authBundleObj?.cookies ||
    cockpitObj?.cookie ||
    cockpitObj?.cookies
  );

  const userAgent = pickString(merged, ["userAgent", "User-Agent", "user-agent"]) || pickString(headersObj, ["user-agent", "User-Agent"]);
  const originator = pickString(merged, ["originator", "Originator"]);
  const version = pickString(merged, ["version", "Version"]);
  const sessionId =
    pickString(merged, ["session_id", "sessionId", "Session-Id"]) ||
    pickString(headersObj, ["session_id", "Session-Id", "x-session-id"]);
  const clientRequestId =
    pickString(merged, ["x-client-request-id", "xClientRequestId", "clientRequestId"]) ||
    pickString(headersObj, ["x-client-request-id", "xClientRequestId"]);

  // Cloudflare / bot binding (opsional)
  const cfClearance =
    pickString(merged, ["cf_clearance", "cf-clearance", "cfClearance"]) ||
    pickString(headersObj, ["cf_clearance", "cf-clearance"]);
  const oaiDeviceId =
    pickString(merged, ["oai-device-id", "oaiDeviceId", "oai_device_id"]) ||
    pickString(headersObj, ["oai-device-id", "oai-device", "x-oai-device-id"]);

  const bundle = {
    accessToken: typeof accessToken === "string" ? accessToken : "",
    ...(idToken ? { idToken } : {}),
    ...(refreshToken ? { refreshToken } : {}),
    ...(cookie ? { cookie } : {}),
    ...(userAgent ? { userAgent } : {}),
    ...(originator ? { originator } : {}),
    ...(version ? { version } : {}),
    ...(sessionId ? { session_id: sessionId } : {}),
    ...(clientRequestId ? { x_client_request_id: clientRequestId } : {}),
    ...(cfClearance ? { cf_clearance: cfClearance } : {}),
    ...(oaiDeviceId ? { oai_device_id: oaiDeviceId } : {}),
    importedAt: Date.now(),
  };

  return bundle;
}

export async function POST(request) {
  try {
    const raw = await request.text();
    let payload = raw;
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = raw;
    }

    const accessToken = findJwtLikeToken(payload);
    const name = typeof payload === "object" && payload ? payload.name : undefined;

    if (!accessToken || typeof accessToken !== "string") {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    const token = accessToken.trim();

    // Extract account info from the JWT (email, workspace, plan)
    let email = null;
    let providerSpecificData = { authMethod: "access_token" };

    // Simpan paket auth lengkap (untuk menyamai Cockpit flow)
    providerSpecificData.codexAuthBundle = extractCodexAuthBundle(payload, token);

    // Try decoding as JWT to extract email + workspace
    try {
      const parts = token.split(".");
      // Cockpit kadang menyimpan JWT tanpa signature (2 bagian). Terima 2 atau 3 bagian.
      if (parts.length >= 2) {
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const missingPadding = (4 - (base64.length % 4)) % 4;
        const padded = base64 + "=".repeat(missingPadding);
        const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8"));

        // Extract from OpenAI JWT structure
        const auth = payload["https://api.openai.com/auth"] || {};
        const profile = payload["https://api.openai.com/profile"] || {};
        email = profile.email || payload.email || payload.preferred_username || null;

        if (auth.chatgpt_account_id) {
          providerSpecificData.chatgptAccountId = auth.chatgpt_account_id;
        }
        if (auth.chatgpt_plan_type) {
          providerSpecificData.chatgptPlanType = auth.chatgpt_plan_type;
        }

        // Store expiry info from JWT if available
        if (payload.exp) {
          providerSpecificData.jwtExp = payload.exp;
        }
      }
    } catch {
      // Not a JWT or malformed — still allow import as raw token
    }

    // Also try extractCodexAccountInfo via id_token-style extraction
    // (the access token itself may contain the same claims)
    if (!email) {
      const info = extractCodexAccountInfo(token);
      if (info.email) email = info.email;
      if (info.chatgptAccountId) providerSpecificData.chatgptAccountId = info.chatgptAccountId;
      if (info.chatgptPlanType) providerSpecificData.chatgptPlanType = info.chatgptPlanType;
    }

    const connectionName = name || email || "ChatGPT Access Token";

    // Save to database as access_token authType (no refresh token)
    const connection = await createProviderConnection({
      provider: "codex",
      authType: "access_token",
      accessToken: token,
      name: connectionName,
      email: email,
      providerSpecificData,
      testStatus: "active",
    });

    return NextResponse.json({
      success: true,
      connection: {
        id: connection.id,
        provider: connection.provider,
        authType: connection.authType,
        email: connection.email,
        name: connection.name,
        workspace: providerSpecificData.chatgptAccountId || null,
        plan: providerSpecificData.chatgptPlanType || null,
      },
    });
  } catch (error) {
    console.log("Codex access token import error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
