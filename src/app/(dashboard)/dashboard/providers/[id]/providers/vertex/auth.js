export const VERTEX_PROVIDER_ID = "vertex";

export function isVertexProvider(providerId) {
  return providerId === "vertex";
}

export function getVertexAuthActions() {
  return [];
}

export function getVertexDefaultAuthType() {
  return "apikey";
}
