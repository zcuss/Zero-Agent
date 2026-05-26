import { CODEX_AUTH_MODES } from "./auth";

export function getCodexUiConfig() {
  return {
    providerId: "codex",
    authTypeForApiModal: CODEX_AUTH_MODES.api,
    oauthLabel: "OAuth",
    apiLabel: "API / Access Token",
    apiPlaceholder: "sk-... or JWT access token",
  };
}

export function getUiConfig() {
  return getCodexUiConfig();
}
