export const CLINE_PROVIDER_ID = "cline";

export function isClineProvider(providerId) {
  return providerId === "cline";
}

export function getClineAuthActions() {
  return [];
}

export function getClineDefaultAuthType() {
  return "apikey";
}
