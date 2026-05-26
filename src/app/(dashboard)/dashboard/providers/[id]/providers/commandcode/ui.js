export function getCommandcodeUiConfig() {
  return {
    providerId: "commandcode",
    oauthLabel: "OAuth",
    apiLabel: "API Key",
    apiPlaceholder: "API key",
  };
}

export function getUiConfig() {
  return getCommandcodeUiConfig();
}
