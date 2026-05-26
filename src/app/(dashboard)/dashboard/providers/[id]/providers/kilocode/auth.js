export const KILOCODE_PROVIDER_ID = "kilocode";

export function isKilocodeProvider(providerId) {
  return providerId === "kilocode";
}

export function getKilocodeAuthActions() {
  return [];
}

export function getKilocodeDefaultAuthType() {
  return "apikey";
}
