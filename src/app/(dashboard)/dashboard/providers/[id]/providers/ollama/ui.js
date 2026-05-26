export function getOllamaUiConfig() {
  return {
    providerId: "ollama",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getOllamaUiConfig();
}
