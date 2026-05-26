export const TOGETHER_PROVIDER_ID = "together";

export function isTogetherProvider(providerId) {
  return providerId === "together";
}

export function getTogetherAuthActions() {
  return [];
}

export function getTogetherDefaultAuthType() {
  return "apikey";
}
