export const GLM_PROVIDER_ID = "glm";

export function isGlmProvider(providerId) {
  return providerId === "glm";
}

export function getGlmAuthActions() {
  return [];
}

export function getGlmDefaultAuthType() {
  return "apikey";
}
