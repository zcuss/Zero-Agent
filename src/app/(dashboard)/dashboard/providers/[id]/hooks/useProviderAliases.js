"use client";

import { useCallback, useEffect, useState } from "react";

export function useProviderAliases(defaultProviderAlias) {
  const [modelAliases, setModelAliases] = useState({});

  const fetchAliases = useCallback(async () => {
    try {
      const res = await fetch("/api/models/alias");
      const data = await res.json();
      if (res.ok) setModelAliases(data.aliases || {});
    } catch (error) {
      console.log("Error fetching aliases:", error);
    }
  }, []);

  const setAlias = useCallback(
    async (modelId, alias, providerAliasOverride = defaultProviderAlias) => {
      const fullModel = `${providerAliasOverride}/${modelId}`;
      try {
        const res = await fetch("/api/models/alias", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: fullModel, alias }),
        });
        if (res.ok) {
          await fetchAliases();
        } else {
          const data = await res.json();
          alert(data.error || "Failed to set alias");
        }
      } catch (error) {
        console.log("Error setting alias:", error);
      }
    },
    [defaultProviderAlias, fetchAliases],
  );

  const deleteAlias = useCallback(
    async (alias) => {
      try {
        const res = await fetch(`/api/models/alias?alias=${encodeURIComponent(alias)}`, {
          method: "DELETE",
        });
        if (res.ok) await fetchAliases();
      } catch (error) {
        console.log("Error deleting alias:", error);
      }
    },
    [fetchAliases],
  );

  useEffect(() => {
    fetchAliases();
  }, [fetchAliases]);

  return {
    modelAliases,
    fetchAliases,
    setAlias,
    deleteAlias,
  };
}
