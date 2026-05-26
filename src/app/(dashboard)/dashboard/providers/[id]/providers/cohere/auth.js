export const COHERE_PROVIDER_ID = "cohere";

export function isCohereProvider(providerId) {
  return providerId === "cohere";
}

export function getCohereAuthActions() {
  return [];
}

export function getCohereDefaultAuthType() {
  return "apikey";
}
