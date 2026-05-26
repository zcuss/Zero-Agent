export const CHUTES_PROVIDER_ID = "chutes";

export function isChutesProvider(providerId) {
  return providerId === "chutes";
}

export function getChutesAuthActions() {
  return [];
}

export function getChutesDefaultAuthType() {
  return "apikey";
}
