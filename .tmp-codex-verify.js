const Database = require('better-sqlite3');
const p = 'D:/Project/AI/ZeroAgent/.build-home/AppData/Roaming/zero-agent/db/data.sqlite';
const db = new Database(p, { readonly: true });
const row = db.prepare("SELECT id, provider, authType, data FROM providerConnections WHERE provider='codex' ORDER BY updatedAt DESC LIMIT 1").get();
if (!row) { console.log('no codex rows'); process.exit(0); }
const data = JSON.parse(row.data || '{}');
const token = data.accessToken || data.apiKey || data.token;
console.log('conn', { id: row.id, authType: row.authType, hasAccessToken: !!data.accessToken, hasRefreshToken: !!data.refreshToken, expiresAt: data.expiresAt || data.expires_at });
if (!token) { console.log('no token in row.data'); process.exit(0); }
(async () => {
  const res = await fetch('https://api.openai.com/v1/models', {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token }
  });
  const txt = await res.text();
  console.log('status', res.status);
  console.log('body', txt.slice(0, 2000));
})();
