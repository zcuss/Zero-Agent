export const SILICONFLOW_PROVIDER_ID = "siliconflow";

export function isSiliconflowProvider(providerId) {
  return providerId === "siliconflow";
}

export function getSiliconflowAuthActions() {
  return [];
}

export function getSiliconflowDefaultAuthType() {
  return "apikey";
}
