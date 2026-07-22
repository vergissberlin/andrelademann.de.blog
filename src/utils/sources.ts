export type Source = {
  title: string;
  url: string;
  /** Outlet or context, e.g. "Ars Technica, June 2026". */
  note?: string;
};

/**
 * Drop sources with empty titles or URLs; preserve relative order.
 */
export function normaliseSources(items: Source[]): Source[] {
  return items.filter(
    item => item.title.trim().length > 0 && item.url.trim().length > 0
  );
}

/**
 * Trim an optional note; return `undefined` when empty after trim.
 */
export function formatSourceNote(note?: string): string | undefined {
  if (note === undefined) return undefined;
  const trimmed = note.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Extract a display hostname from an http(s) URL.
 * Returns `undefined` for invalid or non-http URLs.
 */
export function getSourceHostname(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return undefined;
    }
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}
