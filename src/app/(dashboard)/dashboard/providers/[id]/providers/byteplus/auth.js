export const BYTEPLUS_PROVIDER_ID = "byteplus";

export function isByteplusProvider(providerId) {
  return providerId === "byteplus";
}

export function getByteplusAuthActions() {
  return [];
}

export function getByteplusDefaultAuthType() {
  return "apikey";
}
