export function getBlackboxUiConfig() {
  return {
    providerId: "blackbox",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getBlackboxUiConfig();
}
