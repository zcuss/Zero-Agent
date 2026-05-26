export function getNebiusUiConfig() {
  return {
    providerId: "nebius",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getNebiusUiConfig();
}
