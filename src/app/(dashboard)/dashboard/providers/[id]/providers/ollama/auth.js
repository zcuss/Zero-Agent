export const OLLAMA_PROVIDER_ID = "ollama";

export function isOllamaProvider(providerId) {
  return providerId === "ollama";
}

export function getOllamaAuthActions() {
  return [];
}

export function getOllamaDefaultAuthType() {
  return "apikey";
}
