import { isCodexProvider } from "../providers/codex/auth";
import { isOpenaiProvider } from "../providers/openai/auth";
import { getProviderUiConfig } from "../providers";

export function resolveProviderAuthMode({ providerId, isCompatible, isOAuth, supportsApiKeyAuth }) {
  const isCodex = isCodexProvider(providerId);
  const isOpenai = isOpenaiProvider(providerId);
  const hasDualAuthModes = !isCompatible && (isCodex || isOpenai || (isOAuth && supportsApiKeyAuth));
  const hasTripleAuthModes = !isCompatible && (isCodex || isOpenai);
  const uiConfig = getProviderUiConfig(providerId) || {};
  const oauthConnectionLabel = uiConfig.oauthLabel || "OAuth";
  const apiKeyConnectionLabel = uiConfig.apiLabel || "API Key";
  const accessTokenConnectionLabel = "Access Token";

  return {
    isCodex,
    isOpenai,
    hasDualAuthModes,
    hasTripleAuthModes,
    oauthConnectionLabel,
    apiKeyConnectionLabel,
    accessTokenConnectionLabel,
  };
}
