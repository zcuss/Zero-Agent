export function getGithubUiConfig() {
  return {
    providerId: "github",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getGithubUiConfig();
}
