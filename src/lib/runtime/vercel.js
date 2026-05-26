export const IS_VERCEL = !!process.env.VERCEL;
export const IS_VERCEL_BUILD = IS_VERCEL && process.env.VERCEL_ENV === "production";

export function isServerlessRuntime() {
  // Vercel Serverless/Edge can't rely on local disk persistence.
  return IS_VERCEL;
}
