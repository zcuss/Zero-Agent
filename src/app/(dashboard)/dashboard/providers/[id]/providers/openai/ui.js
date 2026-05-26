export function getOpenaiUiConfig() {
  return {
    providerId: "openai",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getOpenaiUiConfig();
}
