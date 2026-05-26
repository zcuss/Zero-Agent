export function getGeminiCliUiConfig() {
  return {
    providerId: "gemini-cli",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getGeminiCliUiConfig();
}
