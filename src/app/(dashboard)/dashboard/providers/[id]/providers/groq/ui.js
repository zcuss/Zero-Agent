export function getGroqUiConfig() {
  return {
    providerId: "groq",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getGroqUiConfig();
}
