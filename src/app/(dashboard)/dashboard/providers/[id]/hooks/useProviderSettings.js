"use client";

import { useCallback } from "react";

export function useProviderSettings(providerId, { providerStickyLimit, setProviderStrategy, setProviderStickyLimit, setThinkingMode }) {
  const saveProviderStrategy = useCallback(async (strategy, stickyLimit) => {
    try {
      const settingsRes = await fetch("/api/settings", { cache: "no-store" });
      const settingsData = settingsRes.ok ? await settingsRes.json() : {};
      const current = settingsData.providerStrategies || {};

      const override = {};
      if (strategy) override.fallbackStrategy = strategy;
      if (strategy === "round-robin" && stickyLimit !== "") {
        override.stickyRoundRobinLimit = Number(stickyLimit) || 3;
      }

      const updated = { ...current };
      if (Object.keys(override).length === 0) delete updated[providerId];
      else updated[providerId] = override;

      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerStrategies: updated }),
      });
    } catch (error) {
      console.log("Error saving provider strategy:", error);
    }
  }, [providerId]);

  const handleRoundRobinToggle = useCallback((enabled) => {
    const strategy = enabled ? "round-robin" : null;
    const sticky = enabled ? (providerStickyLimit || "1") : providerStickyLimit;
    if (enabled && !providerStickyLimit) setProviderStickyLimit("1");
    setProviderStrategy(strategy);
    saveProviderStrategy(strategy, sticky);
  }, [providerStickyLimit, saveProviderStrategy, setProviderStickyLimit, setProviderStrategy]);

  const handleStickyLimitChange = useCallback((value) => {
    setProviderStickyLimit(value);
    saveProviderStrategy("round-robin", value);
  }, [saveProviderStrategy, setProviderStickyLimit]);

  const saveThinkingConfig = useCallback(async (mode) => {
    try {
      const settingsRes = await fetch("/api/settings", { cache: "no-store" });
      const settingsData = settingsRes.ok ? await settingsRes.json() : {};
      const current = settingsData.providerThinking || {};
      const updated = { ...current };
      if (!mode || mode === "auto") delete updated[providerId];
      else updated[providerId] = { mode };

      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerThinking: updated }),
      });
    } catch (error) {
      console.log("Error saving thinking config:", error);
    }
  }, [providerId]);

  const handleThinkingModeChange = useCallback((mode) => {
    setThinkingMode(mode);
    saveThinkingConfig(mode);
  }, [saveThinkingConfig, setThinkingMode]);

  return {
    handleRoundRobinToggle,
    handleStickyLimitChange,
    handleThinkingModeChange,
  };
}
