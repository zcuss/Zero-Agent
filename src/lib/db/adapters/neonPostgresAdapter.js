import { execFileSync } from "node:child_process";

function normalizeSupabaseUrl(raw) {
  try {
    const u = new URL(raw);

    // pg will interpret sslmode=require as verify-full in newer stacks and can fail
    // on some Windows setups; force SSL config via client option instead.
    u.searchParams.delete("sslmode");
    u.searchParams.delete("ssl");

    if (u.hostname.includes("pooler.supabase.com") && u.port === "5432") {
      const user = decodeURIComponent(u.username || "");
      const m = user.match(/^postgres\.([a-z0-9]+)/i);
      if (m?.[1]) u.hostname = `db.${m[1]}.supabase.co`;
    }

    return u.toString();
  } catch {
    return raw;
  }
}

const PG_TABLES = [
  "_meta",
  "settings",
  "providerConnections",
  "providerNodes",
  "proxyPools",
  "apiKeys",
  "combos",
  "kv",
  "usageHistory",
  "usageDaily",
  "requestDetails",
];

// Kolom camelCase yang dipakai repos (SQLite) tapi harus di-quote di Postgres.
const PG_COLUMNS = [
  "authType",
  "isActive",
  "createdAt",
  "updatedAt",
  "machineId",
  "dateKey",
  "connectionId",
  "apiKey",
  "testStatus",
  "promptTokens",
  "completionTokens",
];

function isDdlLike(sql) {
  return /^\s*(CREATE|ALTER|DROP|DO|BEGIN|COMMIT|SET|GRANT|REVOKE)\b/i.test(String(sql));
}

function quoteTableNames(sql) {
  const s = String(sql);

  // Jangan sentuh DDL/multi-statement bootstrap; SQL ini sudah pakai quoted identifier.
  // Kalau di-quote lagi, jadinya ""table"" dan Postgres error.
  if (isDdlLike(s)) return s;

  const re = new RegExp(`\\b(${PG_TABLES.join("|")})\\b`, "gi");
  return s.replace(re, (m, _name, offset, full) => {
    const src = full ?? s;
    const prev = src[offset - 1];
    const next = src[offset + m.length];
    // Kalau sudah di-quote, biarin.
    if (prev === '"' || next === '"') return m;
    return `"${m}"`;
  });
}

function quoteColumnNames(sql) {
  const s = String(sql);
  if (isDdlLike(s)) return s;

  const re = new RegExp(`\\b(${PG_COLUMNS.join("|")})\\b`, "gi");
  return s.replace(re, (m, _name, offset, full) => {
    const src = full ?? s;
    const prev = src[offset - 1];
    const next = src[offset + m.length];
    if (prev === '"' || next === '"') return m;
    return `"${m}"`;
  });
}

function rewriteInsertOrReplace(sql) {
  const s = String(sql);
  if (!/\bINSERT\s+OR\s+REPLACE\b/i.test(s)) return s;

  // Toleran terhadap variasi spasi/format.
  // Pola umum: INSERT OR REPLACE INTO <table>(<cols>) VALUES(<values>)
  const intoIdx = s.search(/\bINTO\b/i);
  const valuesIdx = s.search(/\bVALUES\b/i);
  if (intoIdx < 0 || valuesIdx < 0) return s.replace(/INSERT\s+OR\s+REPLACE\s+/i, "INSERT ");

  const afterInto = s.slice(intoIdx + 4).trim();
  const parenColsStart = afterInto.indexOf("(");
  if (parenColsStart < 0) return s.replace(/INSERT\s+OR\s+REPLACE\s+/i, "INSERT ");

  const table = afterInto.slice(0, parenColsStart).trim();
  const colsPart = afterInto.slice(parenColsStart);

  const colsOpen = colsPart.indexOf("(");
  const colsClose = colsPart.indexOf(")");
  if (colsOpen < 0 || colsClose < 0) return s.replace(/INSERT\s+OR\s+REPLACE\s+/i, "INSERT ");

  const colsRaw = colsPart.slice(colsOpen + 1, colsClose);
  const cols = colsRaw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const afterValues = s.slice(valuesIdx + 6).trim();
  const vOpen = afterValues.indexOf("(");
  const vClose = afterValues.lastIndexOf(")");
  if (vOpen < 0 || vClose < 0) return s.replace(/INSERT\s+OR\s+REPLACE\s+/i, "INSERT ");

  const valuesRaw = afterValues.slice(vOpen + 1, vClose).trim();

  // Tentukan conflict target.
  let conflictTarget = null;
  const has = (name) => cols.some((c) => c.replace(/"/g, "") === name);
  if (has("scope") && has("key")) conflictTarget = '("scope", "key")';
  else if (has("id")) conflictTarget = '("id")';

  if (!conflictTarget) return s.replace(/INSERT\s+OR\s+REPLACE\s+/i, "INSERT ");

  const updatableCols = cols
    .map((c) => c.replace(/"/g, ""))
    .filter((c) => c !== "id" && c !== "scope" && c !== "key")
    .map((c) => `"${c}" = EXCLUDED."${c}"`);

  const updateClause = updatableCols.length ? `DO UPDATE SET ${updatableCols.join(", ")}` : "DO NOTHING";

  return `INSERT INTO ${table} (${cols.join(", ")}) VALUES(${valuesRaw}) ON CONFLICT ${conflictTarget} ${updateClause}`;
}

function convertPlaceholders(sql, params) {
  if (!params || !params.length) return { sql, params: [] };
  let i = 0;
  const outSql = sql.replace(/\?/g, () => {
    i += 1;
    return `$${i}`;
  });
  return { sql: outSql, params };
}

function normalizeResult(res) {
  if (!res) return { rows: [], rowCount: 0 };
  if (Array.isArray(res)) return { rows: res, rowCount: res.length };
  if (typeof res === "object" && Array.isArray(res.rows)) return { rows: res.rows, rowCount: res.rowCount ?? res.rows.length ?? 0 };
  return { rows: [], rowCount: 0 };
}

function runQuerySync(connectionString, sql, params = []) {
  const normalized = normalizeSupabaseUrl(connectionString);
  const payload = JSON.stringify({ connectionString: normalized, sql, params });

  // Use pg (TCP). Supabase Postgres is not Neon HTTP, so @neondatabase/serverless fetch will fail.
  // Pass payload via stdin to avoid Windows command-line length limits (ENAMETOOLONG).
  const code = `
const { Client } = require('pg');
const fs = require('node:fs');
const payload = JSON.parse(fs.readFileSync(0, 'utf8'));
(async () => {
  const client = new Client({
    connectionString: payload.connectionString,
    ssl: { rejectUnauthorized: false },
    options: '-c search_path=public',
  });
  await client.connect();
  try {
    await client.query('SET search_path TO public');
    const result = await client.query(payload.sql, payload.params || []);
    process.stdout.write(JSON.stringify({ rows: result.rows || [], rowCount: result.rowCount || 0 }));
  } finally {
    try { await client.end(); } catch {}
  }
})().catch((e) => {
  process.stderr.write(String(e && e.stack || e));
  process.exit(1);
});`;

  const out = execFileSync(process.execPath, ["-e", code], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 16,
    input: payload,
    env: {
      ...process.env,
    },
  });
  return normalizeResult(JSON.parse(out || "{}"));
}

export function createNeonPostgresAdapter(connectionString) {
  function query(sql, params = []) {
    const quotedTables = quoteTableNames(sql);
    const quoted = quoteColumnNames(quotedTables);
    const rewritten = rewriteInsertOrReplace(quoted);
    const converted = convertPlaceholders(rewritten, params);
    return runQuerySync(connectionString, converted.sql, converted.params);
  }

  return {
    driver: "neon-postgres",
    dialect: "postgres",

    run(sql, params = []) {
      const r = query(sql, params);
      return { changes: r.rowCount };
    },

    get(sql, params = []) {
      const r = query(sql, params);
      return r.rows[0] ?? null;
    },

    all(sql, params = []) {
      const r = query(sql, params);
      return r.rows;
    },

    exec(sql) {
      const statements = String(sql)
        .split(/;\s*\n|;\s*$/gm)
        .map((s) => s.trim())
        .filter(Boolean);
      for (const stmt of statements) query(stmt);
    },

    transaction(fn) {
      // Existing repos are written against synchronous SQLite-style transactions.
      // Keep callback synchronous; every statement is committed by Postgres individually.
      return fn();
    },

    close() {},
    raw: { connectionString },
  };
}
