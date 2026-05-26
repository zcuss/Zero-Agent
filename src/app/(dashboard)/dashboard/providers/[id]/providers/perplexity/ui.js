export function getPerplexityUiConfig() {
  return {
    providerId: "perplexity",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getPerplexityUiConfig();
}
