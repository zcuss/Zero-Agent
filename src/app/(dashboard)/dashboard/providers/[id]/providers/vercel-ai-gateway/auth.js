export const VERCEL_AI_GATEWAY_PROVIDER_ID = "vercel-ai-gateway";

export function isVercelAiGatewayProvider(providerId) {
  return providerId === "vercel-ai-gateway";
}

export function getVercelAiGatewayAuthActions() {
  return [];
}

export function getVercelAiGatewayDefaultAuthType() {
  return "apikey";
}
