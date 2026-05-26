export const CLOUDFLARE_AI_PROVIDER_ID = "cloudflare-ai";

export function isCloudflareAiProvider(providerId) {
  return providerId === "cloudflare-ai";
}

export function getCloudflareAiAuthActions() {
  return [];
}

export function getCloudflareAiDefaultAuthType() {
  return "apikey";
}
