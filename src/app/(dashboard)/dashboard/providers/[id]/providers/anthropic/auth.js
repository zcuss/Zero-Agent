export const ANTHROPIC_PROVIDER_ID = "anthropic";

export function isAnthropicProvider(providerId) {
  return providerId === "anthropic";
}

export function getAnthropicAuthActions() {
  return [];
}

export function getAnthropicDefaultAuthType() {
  return "apikey";
}
