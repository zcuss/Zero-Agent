export const OPENCODE_GO_PROVIDER_ID = "opencode-go";

export function isOpencodeGoProvider(providerId) {
  return providerId === "opencode-go";
}

export function getOpencodeGoAuthActions() {
  return [];
}

export function getOpencodeGoDefaultAuthType() {
  return "apikey";
}
