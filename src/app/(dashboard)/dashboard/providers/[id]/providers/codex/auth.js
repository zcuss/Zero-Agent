export const CODEX_PROVIDER_ID = "codex";

export const CODEX_AUTH_MODES = {
  oauth: "oauth",
  api: "apikey",
  accessToken: "access_token",
};

export function isCodexProvider(providerId) {
  return providerId === CODEX_PROVIDER_ID;
}

export function getCodexAuthActions() {
  return [
    {
      id: CODEX_AUTH_MODES.oauth,
      label: "OAuth",
      description: "Login lewat OAuth proxy Codex pada port 1455.",
      kind: "oauth",
    },
    {
      id: CODEX_AUTH_MODES.api,
      label: "API Key",
      description: "Tambah OPENAI_API_KEY / compatible API key.",
      kind: "api",
    },
    {
      id: CODEX_AUTH_MODES.accessToken,
      label: "Access Token",
      description: "Paste ChatGPT/Codex access token (JWT) untuk authType access_token.",
      kind: "session",
    },
  ];
}

export function getCodexAuthLabel(authType) {
  if (authType === CODEX_AUTH_MODES.api) return "API Key";
  if (authType === CODEX_AUTH_MODES.accessToken) return "Access Token";
  if (authType === CODEX_AUTH_MODES.oauth) return "OAuth";
  return authType || "Unknown";
}
