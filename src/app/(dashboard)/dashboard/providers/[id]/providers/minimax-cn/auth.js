export const MINIMAX_CN_PROVIDER_ID = "minimax-cn";

export function isMinimaxCnProvider(providerId) {
  return providerId === "minimax-cn";
}

export function getMinimaxCnAuthActions() {
  return [];
}

export function getMinimaxCnDefaultAuthType() {
  return "apikey";
}
