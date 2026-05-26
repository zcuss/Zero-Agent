export const GLM_CN_PROVIDER_ID = "glm-cn";

export function isGlmCnProvider(providerId) {
  return providerId === "glm-cn";
}

export function getGlmCnAuthActions() {
  return [];
}

export function getGlmCnDefaultAuthType() {
  return "apikey";
}
