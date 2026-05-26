export const COMMANDCODE_PROVIDER_ID = "commandcode";

export function isCommandcodeProvider(providerId) {
  return providerId === "commandcode";
}

export function getCommandcodeAuthActions() {
  return [];
}

export function getCommandcodeDefaultAuthType() {
  return "apikey";
}
