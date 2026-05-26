export const XAI_PROVIDER_ID = "xai";

export const XAI_AUTH_MODES = {
  oauth: "oauth",
  api: "api_key",
};

export function isXaiProvider(providerId) {
  return providerId === XAI_PROVIDER_ID;
}

export function getXaiAuthActions() {
  return [
    {
      id: XAI_AUTH_MODES.oauth,
      label: "Grok Build OAuth",
      kind: "oauth",
    },
    {
      id: XAI_AUTH_MODES.api,
      label: "xAI API Key",
      kind: "api",
    },
  ];
}

export function getXaiDefaultAuthType() {
  return XAI_AUTH_MODES.oauth;
}
