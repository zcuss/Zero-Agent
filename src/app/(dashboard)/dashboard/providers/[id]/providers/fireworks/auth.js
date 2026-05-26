export const FIREWORKS_PROVIDER_ID = "fireworks";

export function isFireworksProvider(providerId) {
  return providerId === "fireworks";
}

export function getFireworksAuthActions() {
  return [];
}

export function getFireworksDefaultAuthType() {
  return "apikey";
}
