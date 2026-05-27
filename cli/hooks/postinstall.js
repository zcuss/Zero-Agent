#!/usr/bin/env node

// Postinstall: warm-up SQLite deps into ~/.zero-agent/runtime so the first
// `zero` start doesn't need network. Failure here is non-fatal —
// cli.js will retry at runtime if anything is missing.
const { ensureSqliteRuntime } = require("./sqliteRuntime");
const { ensureTrayRuntime } = require("./trayRuntime");

try {
  ensureSqliteRuntime({ silent: false });
  console.log("[Zero Agent] runtime SQLite deps ready");
} catch (e) {
  console.warn(`[Zero Agent] runtime warm-up skipped: ${e.message}`);
}

try {
  ensureTrayRuntime({ silent: false });
} catch (e) {
  console.warn(`[Zero Agent] tray runtime skipped: ${e.message}`);
}

process.exit(0);
