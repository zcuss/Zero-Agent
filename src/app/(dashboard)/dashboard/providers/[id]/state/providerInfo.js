import {
  APIKEY_PROVIDERS,
  FREE_PROVIDERS,
  FREE_TIER_PROVIDERS,
  OAUTH_PROVIDERS,
  WEB_COOKIE_PROVIDERS,
} from "@/shared/constants/providers";

export function resolveProviderInfo(providerId, providerNode) {
  if (providerNode) {
    return {
      id: providerNode.id,
      name: providerNode.name || (providerNode.type === "anthropic-compatible" ? "Anthropic Compatible" : "OpenAI Compatible"),
      color: providerNode.type === "anthropic-compatible" ? "#D97757" : "#10A37F",
      textIcon: providerNode.type === "anthropic-compatible" ? "AC" : "OC",
      apiType: providerNode.apiType,
      baseUrl: providerNode.baseUrl,
      type: providerNode.type,
    };
  }

  return (
    OAUTH_PROVIDERS[providerId] ||
    APIKEY_PROVIDERS[providerId] ||
    FREE_PROVIDERS[providerId] ||
    FREE_TIER_PROVIDERS[providerId] ||
    WEB_COOKIE_PROVIDERS[providerId]
  );
}

export function resolveProviderAuthFlags(providerId, providerInfo) {
  const authModes = providerInfo?.authModes || [];
  return {
    authModes,
    isOAuth: !!OAUTH_PROVIDERS[providerId] || !!FREE_PROVIDERS[providerId] || authModes.includes("oauth"),
    supportsApiKeyAuth: !!APIKEY_PROVIDERS[providerId] || authModes.includes("apikey"),
    isFreeNoAuth: !!FREE_PROVIDERS[providerId]?.noAuth,
  };
}
