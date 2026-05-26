export const KIMI_PROVIDER_ID = "kimi";

export function isKimiProvider(providerId) {
  return providerId === "kimi";
}

export function getKimiAuthActions() {
  return [];
}

export function getKimiDefaultAuthType() {
  return "apikey";
}
