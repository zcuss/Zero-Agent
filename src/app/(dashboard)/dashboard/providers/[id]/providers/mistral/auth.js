export const MISTRAL_PROVIDER_ID = "mistral";

export function isMistralProvider(providerId) {
  return providerId === "mistral";
}

export function getMistralAuthActions() {
  return [];
}

export function getMistralDefaultAuthType() {
  return "apikey";
}
