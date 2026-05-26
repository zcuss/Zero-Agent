export function getNvidiaUiConfig() {
  return {
    providerId: "nvidia",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getNvidiaUiConfig();
}
