export const CLAUDE_PROVIDER_ID = "claude";

export function isClaudeProvider(providerId) {
  return providerId === "claude";
}

export function getClaudeAuthActions() {
  return [];
}

export function getClaudeDefaultAuthType() {
  return "apikey";
}
