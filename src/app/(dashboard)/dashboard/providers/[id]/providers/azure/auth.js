export const AZURE_PROVIDER_ID = "azure";

export function isAzureProvider(providerId) {
  return providerId === "azure";
}

export function getAzureAuthActions() {
  return [];
}

export function getAzureDefaultAuthType() {
  return "apikey";
}
