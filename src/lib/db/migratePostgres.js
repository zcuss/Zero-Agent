import { PG_SCHEMA_SQL } from "./pgSchema.js";

const _bootstrapped = new WeakSet();

export async function runPostgresBootstrapOnce(adapter) {
  if (_bootstrapped.has(adapter)) return;
  _bootstrapped.add(adapter);
  await adapter.exec(PG_SCHEMA_SQL);
}
