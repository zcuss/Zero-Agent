export const GITHUB_PROVIDER_ID = "github";

export function isGithubProvider(providerId) {
  return providerId === "github";
}

export function getGithubAuthActions() {
  return [];
}

export function getGithubDefaultAuthType() {
  return "apikey";
}
