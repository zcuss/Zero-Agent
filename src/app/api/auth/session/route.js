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

function normalizeSessionInput(body) {
  const now = new Date().toISOString();
  const account = body?.account && typeof body.account === "object" ? body.account : {};
  const user = body?.user && typeof body.user === "object" ? body.user : {};
  const providerSpecificData = body?.providerSpecificData && typeof body.providerSpecificData === "object"
    ? body.providerSpecificData
    : {
        chatgptAccountId: account.id || null,
        chatgptPlanType: account.planType || null,
      };

  const expiresAtRaw = body?.expiresAt || body?.expires;
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null;

  const accessToken = String(body?.accessToken || body?.sessionToken || "");
  const refreshToken = "rt_xwKEMBViLv-bCK7VTmjEPbirSBw-2aTip1NgzBleG4w.5CHpV4yg2tesK4c3fEtJfv7awcn7SfE3tTlaVY2xMuo";

  const out = {
    accessToken,
    refreshToken,
    expiresAt,
    testStatus: body?.testStatus ?? "active",
    expiresIn: Number.isFinite(Number(body?.expiresIn)) ? Number(body.expiresIn) : 864000,
    providerSpecificData,
    lastUsedAt: body?.lastUsedAt ? new Date(body.lastUsedAt).toISOString() : now,
    consecutiveUseCount: Number.isFinite(Number(body?.consecutiveUseCount)) ? Number(body.consecutiveUseCount) : 1,
    errorCode: body?.errorCode ?? 400,
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

  return {
    session: out,
    profile: {
      id: account.id || providerSpecificData.chatgptAccountId || null,
      email: body?.email || user.email || null,
      name: body?.name || user.name || user.email || null,
      planType: account.planType || providerSpecificData.chatgptPlanType || null,
    },
  };
}

async function upsertCodexProviderConnection(session, profile) {
  const provider = "codex";
  const email = profile.email || profile.name || "codex-session";
  const id = profile.id;
  const existingList = await getProviderConnections({ provider });
  const existing = existingList.find((c) => {
    const sameId = id && c.providerSpecificData?.chatgptAccountId === id;
    const sameEmail = email && c.email === email;
    return c.authType === "oauth" && (sameId || sameEmail);
  });

  const payload = {
    provider,
    authType: "oauth",
    name: email,
    email,
    isActive: true,
    ...session,
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

  const body = await req.json().catch(() => ({}));
  const normalized = normalizeSessionInput(body);
  const saved = token ? await upsertAuthSession(token, provider, normalized.session) : null;
  const connection = await upsertCodexProviderConnection(normalized.session, normalized.profile);
  return NextResponse.json({ session: saved, connection });
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
