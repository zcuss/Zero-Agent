export function getDeepseekUiConfig() {
  return {
    providerId: "deepseek",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getDeepseekUiConfig();
}
