export const NEBIUS_PROVIDER_ID = "nebius";

export function isNebiusProvider(providerId) {
  return providerId === "nebius";
}

export function getNebiusAuthActions() {
  return [];
}

export function getNebiusDefaultAuthType() {
  return "apikey";
}
