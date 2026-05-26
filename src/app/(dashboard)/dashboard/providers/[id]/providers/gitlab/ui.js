export function getGitLabUiConfig() {
  return {
    providerId: "gitlab",
    oauthLabel: "OAuth",
    apiLabel: "Access Token",
  };
}

export function getUiConfig() {
  return getGitLabUiConfig();
}
