export const MINIMAX_PROVIDER_ID = "minimax";

export function isMinimaxProvider(providerId) {
  return providerId === "minimax";
}

export function getMinimaxAuthActions() {
  return [];
}

export function getMinimaxDefaultAuthType() {
  return "apikey";
}
