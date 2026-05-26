export const HYPERBOLIC_PROVIDER_ID = "hyperbolic";

export function isHyperbolicProvider(providerId) {
  return providerId === "hyperbolic";
}

export function getHyperbolicAuthActions() {
  return [];
}

export function getHyperbolicDefaultAuthType() {
  return "apikey";
}
