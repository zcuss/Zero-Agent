export const OLLAMA_LOCAL_PROVIDER_ID = "ollama-local";

export function isOllamaLocalProvider(providerId) {
  return providerId === "ollama-local";
}

export function getOllamaLocalAuthActions() {
  return [];
}

export function getOllamaLocalDefaultAuthType() {
  return "apikey";
}
