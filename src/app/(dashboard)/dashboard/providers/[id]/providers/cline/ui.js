export function getClineUiConfig() {
  return {
    providerId: "cline",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getClineUiConfig();
}
