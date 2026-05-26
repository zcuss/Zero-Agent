export function getOpenrouterUiConfig() {
  return {
    providerId: "openrouter",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getOpenrouterUiConfig();
}
