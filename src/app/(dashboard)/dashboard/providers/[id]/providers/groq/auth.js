export const GROQ_PROVIDER_ID = "groq";

export function isGroqProvider(providerId) {
  return providerId === "groq";
}

export function getGroqAuthActions() {
  return [];
}

export function getGroqDefaultAuthType() {
  return "apikey";
}
