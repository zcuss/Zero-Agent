export const GEMINI_PROVIDER_ID = "gemini";

export function isGeminiProvider(providerId) {
  return providerId === "gemini";
}

export function getGeminiAuthActions() {
  return [];
}

export function getGeminiDefaultAuthType() {
  return "apikey";
}
