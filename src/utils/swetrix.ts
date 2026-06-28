import { PUBLIC_SWETRIX_API_URL } from "astro:env/client";

const DEFAULT_SWETRIX_API_URL = "https://analytics-api.kieks.me/log";

/** Swetrix ingest base URL (must include the `/log` path). */
export function getSwetrixApiUrl(): string {
  return PUBLIC_SWETRIX_API_URL ?? DEFAULT_SWETRIX_API_URL;
}

export function getSwetrixNoscriptUrl(pid: string): string {
  const base = getSwetrixApiUrl().replace(/\/$/, "");
  return `${base}/noscript?pid=${encodeURIComponent(pid)}`;
}
