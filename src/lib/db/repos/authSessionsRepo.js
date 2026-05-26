import { getAdapter } from "../driver.js";
import { stringifyJson, parseJson } from "../helpers/jsonCol.js";

const SCOPE = "authSessions";

function normalizeKey(apiKey, provider = "") {
  const k = String(apiKey || "").trim();
  const p = String(provider || "").trim();
  if (!k) throw new Error("apiKey is required");
  return p ? `${k}|${p}` : k;
}

export async function getAuthSession(apiKey, provider) {
  const db = await getAdapter();
  const key = normalizeKey(apiKey, provider);
  const row = db.get(`SELECT value FROM kv WHERE scope = ? AND key = ?`, [SCOPE, key]);
  return row ? parseJson(row.value, null) : null;
}

export async function upsertAuthSession(apiKey, provider, sessionObj) {
  const db = await getAdapter();
  const key = normalizeKey(apiKey, provider);
  const value = stringifyJson(sessionObj || {});
  db.run(`INSERT OR REPLACE INTO kv(scope, key, value) VALUES(?, ?, ?)`, [SCOPE, key, value]);
  return parseJson(value, {});
}

export async function deleteAuthSession(apiKey, provider) {
  const db = await getAdapter();
  const key = normalizeKey(apiKey, provider);
  const r = db.run(`DELETE FROM kv WHERE scope = ? AND key = ?`, [SCOPE, key]);
  return r.changes > 0;
}
