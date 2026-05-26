export function getClaudeUiConfig() {
  return {
    providerId: "claude",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getClaudeUiConfig();
}
