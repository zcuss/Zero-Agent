export const NVIDIA_PROVIDER_ID = "nvidia";

export function isNvidiaProvider(providerId) {
  return providerId === "nvidia";
}

export function getNvidiaAuthActions() {
  return [];
}

export function getNvidiaDefaultAuthType() {
  return "apikey";
}
