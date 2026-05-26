export const GEMINI_CLI_PROVIDER_ID = "gemini-cli";

export function isGeminiCliProvider(providerId) {
  return providerId === "gemini-cli";
}

export function getGeminiCliAuthActions() {
  return [];
}

export function getGeminiCliDefaultAuthType() {
  return "apikey";
}
