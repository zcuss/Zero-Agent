export const XIAOMI_MIMO_PROVIDER_ID = "xiaomi-mimo";

export function isXiaomiMimoProvider(providerId) {
  return providerId === "xiaomi-mimo";
}

export function getXiaomiMimoAuthActions() {
  return [];
}

export function getXiaomiMimoDefaultAuthType() {
  return "apikey";
}
