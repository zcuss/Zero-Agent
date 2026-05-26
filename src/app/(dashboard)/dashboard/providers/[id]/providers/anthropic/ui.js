export function getAnthropicUiConfig() {
  return {
    providerId: "anthropic",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getAnthropicUiConfig();
}
