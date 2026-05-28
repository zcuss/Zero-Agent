import { CODEX_PROVIDER_ID } from "./auth";

export async function importCodexToken(accessTokenOrPayload, name) {
  const body = typeof accessTokenOrPayload === "string"
    ? accessTokenOrPayload
    : JSON.stringify(accessTokenOrPayload);

  const res = await fetch("/api/oauth/codex/import-token", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: body.trim(),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return { success: false, error: data?.error || "Failed to import access token" };
  }

  return data || { success: true };
}

export async function startCodexOAuthProxy({ appPort, state, codeVerifier, redirectUri }) {
  const qs = new URLSearchParams({
    app_port: String(appPort),
    state: String(state),
    code_verifier: String(codeVerifier),
    redirect_uri: String(redirectUri),
  });
  const res = await fetch(`/api/oauth/${CODEX_PROVIDER_ID}/start-proxy?${qs.toString()}`);
  return res.json();
}

export async function pollCodexOAuthStatus(state) {
  const res = await fetch(`/api/oauth/${CODEX_PROVIDER_ID}/poll-status?state=${encodeURIComponent(state)}`);
  return res.json();
}
