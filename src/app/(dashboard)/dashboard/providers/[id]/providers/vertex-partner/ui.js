export function getVertexPartnerUiConfig() {
  return {
    providerId: "vertex-partner",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getVertexPartnerUiConfig();
}
