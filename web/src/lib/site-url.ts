/** App origin for OAuth redirects. Prefer NEXT_PUBLIC_SITE_URL in .env.local for local dev. */
export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:3000";
}
