export const XIAOMI_TOKENPLAN_PROVIDER_ID = "xiaomi-tokenplan";

export function isXiaomiTokenplanProvider(providerId) {
  return providerId === "xiaomi-tokenplan";
}

export function getXiaomiTokenplanAuthActions() {
  return [];
}

export function getXiaomiTokenplanDefaultAuthType() {
  return "apikey";
}
