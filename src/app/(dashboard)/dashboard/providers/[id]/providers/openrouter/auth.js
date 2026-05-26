export const OPENROUTER_PROVIDER_ID = "openrouter";

export function isOpenrouterProvider(providerId) {
  return providerId === "openrouter";
}

export function getOpenrouterAuthActions() {
  return [];
}

export function getOpenrouterDefaultAuthType() {
  return "apikey";
}
