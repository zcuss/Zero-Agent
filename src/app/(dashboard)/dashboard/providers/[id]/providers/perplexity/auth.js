export const PERPLEXITY_PROVIDER_ID = "perplexity";

export function isPerplexityProvider(providerId) {
  return providerId === "perplexity";
}

export function getPerplexityAuthActions() {
  return [];
}

export function getPerplexityDefaultAuthType() {
  return "apikey";
}
