export const ANTIGRAVITY_PROVIDER_ID = "antigravity";

export function isAntigravityProvider(providerId) {
  return providerId === "antigravity";
}

export function getAntigravityAuthActions() {
  return [];
}

export function getAntigravityDefaultAuthType() {
  return "apikey";
}
