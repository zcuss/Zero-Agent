import { AI_PROVIDERS } from "@/shared/constants/providers";
import * as codex from "./codex";
import * as cursor from "./cursor";
import * as gitlab from "./gitlab";
import * as iflow from "./iflow";
import * as kiro from "./kiro";
import * as openai from "./openai";
import * as xai from "./xai";

const PROVIDER_MODULES = {
  codex,
  cursor,
  gitlab,
  iflow,
  kiro,
  openai,
  xai,
};

function buildFallbackModule(providerId) {
  const provider = AI_PROVIDERS?.[providerId];
  if (!provider) return null;

  const hasOAuth =
    provider.hasOAuth === true ||
    (Array.isArray(provider.authModes) && provider.authModes.includes("oauth"));
  const hasApiKey =
    provider.noAuth !== true &&
    (Array.isArray(provider.authModes)
      ? provider.authModes.includes("apikey") || provider.authModes.includes("api_key")
      : provider.authType !== "cookie");

  const oauthLabel = provider.id === "xai" ? "Grok Build OAuth" : "OAuth";
  const apiLabel = provider.id === "xai" ? "xAI API Key" : "API Key";
  const cookieLabel = provider.authHint ? "Cookie" : "Cookie";

  return {
    isProvider: (id) => id === providerId,
    auth: {
      getDefaultAuthType: () => {
        if (provider.noAuth) return "none";
        if (provider.authType === "cookie") return "cookie";
        if (hasOAuth) return "oauth";
        return "apikey";
      },
      getAuthActions: () => {
        if (provider.noAuth) return [];
        if (provider.authType === "cookie") {
          return [{ id: "cookie", label: cookieLabel, kind: "api" }];
        }
        if (hasOAuth && hasApiKey) {
          return [
            { id: "oauth", label: oauthLabel, kind: "oauth" },
            { id: "apikey", label: apiLabel, kind: "api" },
          ];
        }
        if (hasOAuth) return [{ id: "oauth", label: oauthLabel, kind: "oauth" }];
        return [{ id: "apikey", label: apiLabel, kind: "api" }];
      },
    },
    api: {
      importToken: null,
      startOAuth: null,
      pollOAuth: null,
    },
    ui: {
      getUiConfig: () => ({
        providerId,
        oauthLabel,
        apiLabel: provider.authType === "cookie" ? cookieLabel : apiLabel,
      }),
    },
  };
}

export function getProviderModule(providerId) {
  return PROVIDER_MODULES[providerId] || buildFallbackModule(providerId);
}

export function hasProviderModule(providerId) {
  return !!getProviderModule(providerId);
}

export function isProvider(providerId) {
  return !!AI_PROVIDERS?.[providerId];
}

export function getProviderUiConfig(providerId) {
  const mod = getProviderModule(providerId);
  if (!mod) return null;

  if (typeof mod.getUiConfig === "function") return mod.getUiConfig();
  if (mod.ui && typeof mod.ui.getUiConfig === "function") return mod.ui.getUiConfig();

  return null;
}

export { PROVIDER_MODULES };
