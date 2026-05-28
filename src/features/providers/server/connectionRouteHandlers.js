import { NextResponse } from "next/server";
import {
  getProviderConnectionById,
  getProxyPoolById,
  updateProviderConnection,
  deleteProviderConnection,
} from "@/models";

function stripSensitiveConnectionFields(connection) {
  const result = { ...connection };
  delete result.apiKey;
  delete result.accessToken;
  delete result.refreshToken;
  delete result.idToken;
  return result;
}

function normalizeProxyConfig(body = {}) {
  const hasAnyProxyField =
    Object.prototype.hasOwnProperty.call(body, "connectionProxyEnabled") ||
    Object.prototype.hasOwnProperty.call(body, "connectionProxyUrl") ||
    Object.prototype.hasOwnProperty.call(body, "connectionNoProxy");

  if (!hasAnyProxyField) return { hasAnyProxyField: false };

  const enabled = body?.connectionProxyEnabled === true;
  const url = typeof body?.connectionProxyUrl === "string" ? body.connectionProxyUrl.trim() : "";
  const noProxy = typeof body?.connectionNoProxy === "string" ? body.connectionNoProxy.trim() : "";

  if (enabled && !url) {
    return {
      hasAnyProxyField: true,
      error: "Connection proxy URL is required when connection proxy is enabled",
    };
  }

  return {
    hasAnyProxyField: true,
    connectionProxyEnabled: enabled,
    connectionProxyUrl: url,
    connectionNoProxy: noProxy,
  };
}

async function normalizeProxyPoolUpdate(proxyPoolIdInput) {
  if (proxyPoolIdInput === undefined) {
    return { hasProxyPoolField: false, proxyPoolId: null };
  }

  if (proxyPoolIdInput === null || proxyPoolIdInput === "" || proxyPoolIdInput === "__none__") {
    return { hasProxyPoolField: true, proxyPoolId: null };
  }

  const proxyPoolId = String(proxyPoolIdInput).trim();
  if (!proxyPoolId) {
    return { hasProxyPoolField: true, proxyPoolId: null };
  }

  const proxyPool = await getProxyPoolById(proxyPoolId);
  if (!proxyPool) {
    return { hasProxyPoolField: true, error: "Proxy pool not found" };
  }

  return { hasProxyPoolField: true, proxyPoolId };
}

function shouldMergeProviderSpecificData(existing, incoming, hasLegacyProxy, hasProxyPoolField) {
  return existing !== undefined || incoming !== undefined || hasLegacyProxy || hasProxyPoolField;
}

export async function getConnectionById(id) {
  const connection = await getProviderConnectionById(id);

  if (!connection) {
    return NextResponse.json({ error: "Connection not found" }, { status: 404 });
  }

  return NextResponse.json({ connection: stripSensitiveConnectionFields(connection) });
}

export async function updateConnectionById(id, body) {
  const {
    name,
    priority,
    globalPriority,
    defaultModel,
    isActive,
    apiKey,
    accessToken,
    refreshToken,
    idToken,
    authType,
    testStatus,
    lastError,
    lastErrorAt,
    providerSpecificData,
  } = body;

  const existing = await getProviderConnectionById(id);
  if (!existing) {
    return NextResponse.json({ error: "Connection not found" }, { status: 404 });
  }

  const proxyConfig = normalizeProxyConfig(body);
  if (proxyConfig.error) {
    return NextResponse.json({ error: proxyConfig.error }, { status: 400 });
  }

  const proxyPoolResult = await normalizeProxyPoolUpdate(body.proxyPoolId);
  if (proxyPoolResult.error) {
    return NextResponse.json({ error: proxyPoolResult.error }, { status: 400 });
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (priority !== undefined) updateData.priority = priority;
  if (globalPriority !== undefined) updateData.globalPriority = globalPriority;
  if (defaultModel !== undefined) updateData.defaultModel = defaultModel;
  if (isActive !== undefined) updateData.isActive = isActive;

  // Allow updating credentials based on authType
  if (authType === "access_token" || existing.authType === "access_token") {
    if (authType !== undefined) updateData.authType = "access_token";
    if (accessToken) updateData.accessToken = accessToken;
    if (refreshToken) updateData.refreshToken = refreshToken;
    if (idToken) updateData.idToken = idToken;
  } else if (apiKey && existing.authType === "apikey") {
    updateData.apiKey = apiKey;
  }

  if (testStatus !== undefined) updateData.testStatus = testStatus;
  if (lastError !== undefined) updateData.lastError = lastError;
  if (lastErrorAt !== undefined) updateData.lastErrorAt = lastErrorAt;

  if (
    shouldMergeProviderSpecificData(
      existing.providerSpecificData,
      providerSpecificData,
      proxyConfig.hasAnyProxyField,
      proxyPoolResult.hasProxyPoolField,
    )
  ) {
    updateData.providerSpecificData = {
      ...(existing.providerSpecificData || {}),
      ...(providerSpecificData || {}),
    };

    if (proxyConfig.hasAnyProxyField) {
      updateData.providerSpecificData.connectionProxyEnabled = proxyConfig.connectionProxyEnabled;
      updateData.providerSpecificData.connectionProxyUrl = proxyConfig.connectionProxyUrl;
      updateData.providerSpecificData.connectionNoProxy = proxyConfig.connectionNoProxy;
    }

    if (proxyPoolResult.hasProxyPoolField) {
      if (proxyPoolResult.proxyPoolId === null) {
        delete updateData.providerSpecificData.proxyPoolId;
      } else {
        updateData.providerSpecificData.proxyPoolId = proxyPoolResult.proxyPoolId;
      }
    }
  }

  const updated = await updateProviderConnection(id, updateData);
  return NextResponse.json({ connection: stripSensitiveConnectionFields(updated) });
}

export async function deleteConnectionById(id) {
  const deleted = await deleteProviderConnection(id);
  if (!deleted) {
    return NextResponse.json({ error: "Connection not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Connection deleted successfully" });
}
