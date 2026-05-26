import { isCodexProvider } from "../providers/codex/auth";
import { isOpenaiProvider } from "../providers/openai/auth";
import { getProviderUiConfig } from "../providers";

export function resolveProviderAuthMode({ providerId, isCompatible, isOAuth, supportsApiKeyAuth }) {
  const isCodex = isCodexProvider(providerId);
  const isOpenai = isOpenaiProvider(providerId);
  const hasDualAuthModes = !isCompatible && (isCodex || isOpenai || (isOAuth && supportsApiKeyAuth));
  const uiConfig = getProviderUiConfig(providerId) || {};
  const oauthConnectionLabel = uiConfig.oauthLabel || "OAuth";
  const apiKeyConnectionLabel = isCodex
    ? "API / Access Token"
    : (uiConfig.apiLabel || "API Key");

  return {
    isCodex,
    isOpenai,
    hasDualAuthModes,
    oauthConnectionLabel,
    apiKeyConnectionLabel,
  };
}
