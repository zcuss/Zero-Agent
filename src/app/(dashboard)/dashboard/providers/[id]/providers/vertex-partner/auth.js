export const VERTEX_PARTNER_PROVIDER_ID = "vertex-partner";

export function isVertexPartnerProvider(providerId) {
  return providerId === "vertex-partner";
}

export function getVertexPartnerAuthActions() {
  return [];
}

export function getVertexPartnerDefaultAuthType() {
  return "apikey";
}
