import { KIRO_PROVIDER_ID } from "./auth";

export async function startKiroDeviceCode(params = {}) {
  const qs = new URLSearchParams(params);
  const res = await fetch(`/api/oauth/${KIRO_PROVIDER_ID}/device-code?${qs.toString()}`);
  return res.json();
}

export async function pollKiroDeviceCode(deviceCode, codeVerifier, extraData) {
  const res = await fetch(`/api/oauth/${KIRO_PROVIDER_ID}/poll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceCode, codeVerifier, extraData }),
  });
  return res.json();
}

export async function exchangeKiroOAuthCode(payload) {
  const res = await fetch(`/api/oauth/${KIRO_PROVIDER_ID}/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
