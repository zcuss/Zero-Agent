export const VOLCENGINE_ARK_PROVIDER_ID = "volcengine-ark";

export function isVolcengineArkProvider(providerId) {
  return providerId === "volcengine-ark";
}

export function getVolcengineArkAuthActions() {
  return [];
}

export function getVolcengineArkDefaultAuthType() {
  return "apikey";
}
