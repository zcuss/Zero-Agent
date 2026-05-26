export const CEREBRAS_PROVIDER_ID = "cerebras";

export function isCerebrasProvider(providerId) {
  return providerId === "cerebras";
}

export function getCerebrasAuthActions() {
  return [];
}

export function getCerebrasDefaultAuthType() {
  return "apikey";
}
