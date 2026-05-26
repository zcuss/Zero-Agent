export const BLACKBOX_PROVIDER_ID = "blackbox";

export function isBlackboxProvider(providerId) {
  return providerId === "blackbox";
}

export function getBlackboxAuthActions() {
  return [];
}

export function getBlackboxDefaultAuthType() {
  return "apikey";
}
