"use client";

import { useCallback, useEffect, useState } from "react";

export function useProviderConnections(providerId, isCompatible) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerNode, setProviderNode] = useState(null);
  const [proxyPools, setProxyPools] = useState([]);
  const [providerStrategy, setProviderStrategy] = useState(null);
  const [providerStickyLimit, setProviderStickyLimit] = useState("1");
  const [thinkingMode, setThinkingMode] = useState("auto");

  const fetchConnections = useCallback(async () => {
    try {
      const [connectionsRes, nodesRes, proxyPoolsRes, settingsRes] = await Promise.all([
        fetch("/api/providers", { cache: "no-store" }),
        fetch("/api/provider-nodes", { cache: "no-store" }),
        fetch("/api/proxy-pools?isActive=true", { cache: "no-store" }),
        fetch("/api/settings", { cache: "no-store" }),
      ]);

      const connectionsData = await connectionsRes.json();
      const nodesData = await nodesRes.json();
      const proxyPoolsData = await proxyPoolsRes.json();
      const settingsData = settingsRes.ok ? await settingsRes.json() : {};

      if (connectionsRes.ok) {
        const filtered = (connectionsData.connections || []).filter((c) => c.provider === providerId);
        setConnections(filtered);
      }

      if (proxyPoolsRes.ok) {
        setProxyPools(proxyPoolsData.proxyPools || []);
      }

      const override = (settingsData.providerStrategies || {})[providerId] || {};
      setProviderStrategy(override.fallbackStrategy || null);
      setProviderStickyLimit(override.stickyRoundRobinLimit != null ? String(override.stickyRoundRobinLimit) : "1");

      const thinkingCfg = (settingsData.providerThinking || {})[providerId] || {};
      setThinkingMode(thinkingCfg.mode || "auto");

      if (nodesRes.ok) {
        let node = (nodesData.nodes || []).find((entry) => entry.id === providerId) || null;
        if (!node && isCompatible) {
          for (let attempt = 0; attempt < 3; attempt += 1) {
            await new Promise((resolve) => setTimeout(resolve, 150));
            const retryRes = await fetch("/api/provider-nodes", { cache: "no-store" });
            if (!retryRes.ok) continue;
            const retryData = await retryRes.json();
            node = (retryData.nodes || []).find((entry) => entry.id === providerId) || null;
            if (node) break;
          }
        }
        setProviderNode(node);
      }
    } catch (error) {
      console.log("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  }, [providerId, isCompatible]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return {
    connections,
    loading,
    providerNode,
    proxyPools,
    providerStrategy,
    providerStickyLimit,
    thinkingMode,
    setConnections,
    setProviderNode,
    setProviderStrategy,
    setProviderStickyLimit,
    setThinkingMode,
    setProxyPools,
    fetchConnections,
  };
}
