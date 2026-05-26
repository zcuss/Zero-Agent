export const CODEX_PROVIDER_ID = "codex";

export const CODEX_AUTH_MODES = {
  oauth: "oauth",
  api: "access_token",
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
      label: "API / Access Token",
      description: "Tambah raw ChatGPT/Codex access token sebagai koneksi API.",
      kind: "api",
    },
  ];
}

export function getCodexAuthLabel(authType) {
  if (authType === CODEX_AUTH_MODES.api) return "API / Access Token";
  if (authType === CODEX_AUTH_MODES.oauth) return "OAuth";
  return authType || "Unknown";
}
