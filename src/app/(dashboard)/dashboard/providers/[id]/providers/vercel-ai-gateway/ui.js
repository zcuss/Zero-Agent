export function getVercelAiGatewayUiConfig() {
  return {
    providerId: "vercel-ai-gateway",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getVercelAiGatewayUiConfig();
}
