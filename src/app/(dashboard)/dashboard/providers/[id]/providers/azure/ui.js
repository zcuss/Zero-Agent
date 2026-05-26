export function getAzureUiConfig() {
  return {
    providerId: "azure",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getAzureUiConfig();
}
