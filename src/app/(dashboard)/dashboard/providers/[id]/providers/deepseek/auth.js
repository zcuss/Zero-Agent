export const DEEPSEEK_PROVIDER_ID = "deepseek";

export function isDeepseekProvider(providerId) {
  return providerId === "deepseek";
}

export function getDeepseekAuthActions() {
  return [];
}

export function getDeepseekDefaultAuthType() {
  return "apikey";
}
