"use client";

import { useCallback, useEffect, useState } from "react";

export function useProviderDisabledModels(providerStorageAlias) {
  const [disabledModelIds, setDisabledModelIds] = useState([]);

  const fetchDisabledModels = useCallback(async () => {
    if (!providerStorageAlias) return;
    try {
      const res = await fetch(
        `/api/models/disabled?providerAlias=${encodeURIComponent(providerStorageAlias)}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (res.ok) setDisabledModelIds(data.ids || []);
    } catch (error) {
      console.log("Error fetching disabled models:", error);
    }
  }, [providerStorageAlias]);

  const disableModels = useCallback(
    async (ids) => {
      if (!providerStorageAlias) return;
      if (!ids?.length) return;
      try {
        const res = await fetch("/api/models/disabled", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ providerAlias: providerStorageAlias, ids }),
        });
        if (res.ok) await fetchDisabledModels();
      } catch (error) {
        console.log("Error disabling models:", error);
      }
    },
    [providerStorageAlias, fetchDisabledModels],
  );

  const enableModel = useCallback(
    async (modelId) => {
      if (!providerStorageAlias) return;
      try {
        const res = await fetch(
          `/api/models/disabled?providerAlias=${encodeURIComponent(providerStorageAlias)}&id=${encodeURIComponent(modelId)}`,
          { method: "DELETE" },
        );
        if (res.ok) await fetchDisabledModels();
      } catch (error) {
        console.log("Error enabling model:", error);
      }
    },
    [providerStorageAlias, fetchDisabledModels],
  );

  const enableAll = useCallback(async () => {
    if (!providerStorageAlias) return;
    try {
      const res = await fetch(
        `/api/models/disabled?providerAlias=${encodeURIComponent(providerStorageAlias)}`,
        { method: "DELETE" },
      );
      if (res.ok) await fetchDisabledModels();
    } catch (error) {
      console.log("Error enabling all models:", error);
    }
  }, [providerStorageAlias, fetchDisabledModels]);

  useEffect(() => {
    fetchDisabledModels();
  }, [fetchDisabledModels]);

  return {
    disabledModelIds,
    fetchDisabledModels,
    disableModels,
    enableModel,
    enableAll,
  };
}
