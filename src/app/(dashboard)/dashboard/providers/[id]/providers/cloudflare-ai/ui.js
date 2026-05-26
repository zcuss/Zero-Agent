export function getCloudflareAiUiConfig() {
  return {
    providerId: "cloudflare-ai",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getCloudflareAiUiConfig();
}
