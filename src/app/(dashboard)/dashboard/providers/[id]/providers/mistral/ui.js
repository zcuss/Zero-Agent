export function getMistralUiConfig() {
  return {
    providerId: "mistral",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getMistralUiConfig();
}
