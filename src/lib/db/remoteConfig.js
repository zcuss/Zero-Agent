export const DB_BACKEND = (process.env.ZERO_DB_BACKEND || "auto").toLowerCase();

export function getRemoteDbConfig() {
  return {
    backend: DB_BACKEND,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    neonDatabaseUrl: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || "",
  };
}

export function isRemoteDbEnabled() {
  return DB_BACKEND === "supabase" || DB_BACKEND === "neon";
}
