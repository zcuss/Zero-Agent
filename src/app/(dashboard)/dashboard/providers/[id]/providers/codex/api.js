import { CODEX_PROVIDER_ID } from "./auth";

export async function importCodexToken(accessToken, name) {
  const res = await fetch("/api/oauth/codex/import-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken, name }),
  });
  return res.json();
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
