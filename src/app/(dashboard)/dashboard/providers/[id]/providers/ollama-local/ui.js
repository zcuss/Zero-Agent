export function getOllamaLocalUiConfig() {
  return {
    providerId: "ollama-local",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getOllamaLocalUiConfig();
}
