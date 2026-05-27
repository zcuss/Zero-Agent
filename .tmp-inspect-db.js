const Database = require('better-sqlite3');
const p = 'D:/Project/AI/ZeroAgent/.build-home/AppData/Roaming/zero-agent/db/data.sqlite';
const db = new Database(p, { readonly: true });
console.log('db', p);
console.log('tables', db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all().map(t => t.name));
console.log('cols', db.prepare('PRAGMA table_info(providerConnections)').all().map(c => c.name));
const rows = db.prepare("SELECT id, provider, authType, name, email, priority, isActive, createdAt, updatedAt, substr(data,1,500) as dataPreview FROM providerConnections WHERE provider in ('codex','openai') ORDER BY updatedAt DESC LIMIT 20").all();
console.log(JSON.stringify(rows, null, 2));
