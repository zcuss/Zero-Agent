export function getKiroUiConfig() {
  return {
    providerId: "kiro",
    oauthLabel: "OAuth",
    apiLabel: "Refresh Token",
    apiPlaceholder: "Kiro refresh token",
  };
}

export function getUiConfig() {
  return getKiroUiConfig();
}
