export const ALICODE_PROVIDER_ID = "alicode";

export function isAlicodeProvider(providerId) {
  return providerId === "alicode";
}

export function getAlicodeAuthActions() {
  return [];
}

export function getAlicodeDefaultAuthType() {
  return "apikey";
}
