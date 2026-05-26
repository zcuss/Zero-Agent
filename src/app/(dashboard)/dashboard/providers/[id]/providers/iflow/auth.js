export const IFLOW_PROVIDER_ID = "iflow";

export const IFLOW_AUTH_MODES = {
  oauth: "oauth",
  cookie: "cookie",
};

export function isIflowProvider(providerId) {
  return providerId === IFLOW_PROVIDER_ID;
}

export function getIflowAuthActions() {
  return [
    { id: IFLOW_AUTH_MODES.oauth, label: "OAuth", kind: "oauth" },
    { id: IFLOW_AUTH_MODES.cookie, label: "Cookie", kind: "api" },
  ];
}
