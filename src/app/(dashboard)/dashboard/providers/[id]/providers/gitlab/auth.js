export const GITLAB_PROVIDER_ID = "gitlab";

export const GITLAB_AUTH_MODES = {
  oauth: "oauth",
  token: "access_token",
};

export function isGitLabProvider(providerId) {
  return providerId === GITLAB_PROVIDER_ID;
}

export function getGitLabAuthActions() {
  return [
    { id: GITLAB_AUTH_MODES.oauth, label: "OAuth", kind: "oauth" },
    { id: GITLAB_AUTH_MODES.token, label: "Access Token", kind: "api" },
  ];
}
