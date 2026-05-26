export const OPENCODE_PROVIDER_ID = "opencode";

export function isOpencodeProvider(providerId) {
  return providerId === "opencode";
}

export function getOpencodeAuthActions() {
  return [];
}

export function getOpencodeDefaultAuthType() {
  return "apikey";
}
