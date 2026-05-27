import { importOpenaiAccessToken } from "./accesstoken";

export async function importOpenaiToken(accessToken, name) {
  const res = await fetch("/api/oauth/codex/import-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken, name }),
  });
  return res.json();
}

export async function startOpenaiOAuthProxy({ appPort, state, codeVerifier, redirectUri }) {
  const qs = new URLSearchParams({
    app_port: String(appPort),
    state: String(state),
    code_verifier: String(codeVerifier),
    redirect_uri: String(redirectUri),
  });
  const res = await fetch(`/api/oauth/codex/start-proxy?${qs.toString()}`);
  return res.json();
}

export async function pollOpenaiOAuthStatus(state) {
  const res = await fetch(`/api/oauth/codex/poll-status?state=${encodeURIComponent(state)}`);
  return res.json();
}

export function getOpenaiApi() {
  return {
    importSession: importOpenaiAccessToken,
    importToken: importOpenaiToken,
    startOAuth: startOpenaiOAuthProxy,
    pollOAuth: pollOpenaiOAuthStatus,
  };
}
