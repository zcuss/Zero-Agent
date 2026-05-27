export const OPENAI_PROVIDER_ID = "openai";

export const OPENAI_AUTH_MODES = {
  oauth: "oauth",
  api: "access_token",
};

export function isOpenaiProvider(providerId) {
  return providerId === OPENAI_PROVIDER_ID;
}

export function getOpenaiAuthActions() {
  return [
    {
      id: OPENAI_AUTH_MODES.oauth,
      label: "OAuth",
      description: "Login lewat OAuth OpenAI resmi.",
      kind: "oauth",
    },
    {
      id: OPENAI_AUTH_MODES.api,
      label: "API / Access Token",
      description: "Tambah raw OpenAI/Codex access token sebagai koneksi API.",
      kind: "api",
    },
  ];
}

export function getOpenaiAuthLabel(authType) {
  if (authType === OPENAI_AUTH_MODES.api) return "API / Access Token";
  if (authType === OPENAI_AUTH_MODES.oauth) return "OAuth";
  return authType || "Unknown";
}

export async function importOpenaiAccessToken({ apiKey, provider = OPENAI_PROVIDER_ID, payload }) {
  const res = await fetch(`/api/auth/session?provider=${encodeURIComponent(provider)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": String(apiKey || "").trim(),
    },
    body: JSON.stringify(payload || {}),
  });
  return res.json();
}
