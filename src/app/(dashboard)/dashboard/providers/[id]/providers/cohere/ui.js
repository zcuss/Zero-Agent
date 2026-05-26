export function getCohereUiConfig() {
  return {
    providerId: "cohere",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getCohereUiConfig();
}
