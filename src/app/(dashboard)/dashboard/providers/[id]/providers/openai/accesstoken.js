// NOTE:
// File ini khusus untuk helper import access-token/session.
// Konstanta/mode/auth-actions didefinisikan di `auth.js` supaya tidak bentrok export.

import { OPENAI_PROVIDER_ID } from "./auth";

export async function importOpenaiAccessToken({ apiKey, provider = OPENAI_PROVIDER_ID, payload }) {
  const res = await fetch(`/api/auth/session?provider=${encodeURIComponent(provider)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": String(apiKey || "").trim(),
    },
    body: JSON.stringify(payload || {}),
  });
  return res.json();
}
