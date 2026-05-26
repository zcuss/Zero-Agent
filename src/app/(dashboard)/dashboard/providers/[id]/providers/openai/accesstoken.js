export async function importOpenaiAccessToken({ apiKey, provider = "codex", payload }) {
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
