export const CURSOR_PROVIDER_ID = "cursor";

export const CURSOR_AUTH_MODES = {
  oauth: "oauth",
  api: "api_key",
};

export function isCursorProvider(providerId) {
  return providerId === CURSOR_PROVIDER_ID;
}

export function getCursorAuthActions() {
  return [
    { id: CURSOR_AUTH_MODES.oauth, label: "OAuth", kind: "oauth" },
    { id: CURSOR_AUTH_MODES.api, label: "API Key", kind: "api" },
  ];
}
