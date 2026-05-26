export const OPENAI_PROVIDER_ID = "openai";

export function isOpenaiProvider(providerId) {
  return providerId === "openai";
}

export const OPENAI_AUTH_MODES = {
  oauth: "oauth",
  apikey: "apikey",
  session: "session",
};

export function getOpenaiAuthActions() {
  return [
    {
      id: OPENAI_AUTH_MODES.oauth,
      label: "OAuth",
      description: "Login lewat OAuth (jika tersedia).",
      kind: "oauth",
    },
    {
      id: OPENAI_AUTH_MODES.apikey,
      label: "API Key",
      description: "Tambah OpenAI API key resmi.",
      kind: "api",
    },
    {
      id: OPENAI_AUTH_MODES.session,
      label: "Paste Session",
      description: "Paste JSON session (accessToken/expires/account/user) untuk import via /api/auth/session.",
      kind: "api",
    },
  ];
}

export function getOpenaiDefaultAuthType() {
  return OPENAI_AUTH_MODES.apikey;
}
