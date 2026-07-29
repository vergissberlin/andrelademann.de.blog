/** Prefix of the generic `data-swetrix-meta-*` attributes, as seen in a `dataset`. */
const META_PREFIX = "swetrixMeta";

/** Swetrix truncates long meta values; keep payloads small and comparable. */
const MAX_VALUE_LENGTH = 100;

/**
 * Read Swetrix event meta from an element's `dataset`.
 *
 * Generic form: `data-swetrix-meta-<key>` becomes `<key>` in camelCase, so
 * `data-swetrix-meta-file-type="PDF"` yields `{ fileType: "PDF" }`.
 *
 * Legacy form: `data-swetrix-platform` is still read as `platform`. An explicit
 * `data-swetrix-meta-platform` takes precedence over it.
 *
 * Values are trimmed and truncated; blank ones are dropped. Returns `undefined`
 * when no meta is present, matching what `track()` expects for an absent payload.
 *
 * Takes a plain record rather than `DOMStringMap` so that a `dataset` can be
 * passed straight through, and tests can pass an object literal.
 */
export function readSwetrixMeta(
  dataset: Record<string, string | undefined>
): Record<string, string> | undefined {
  const meta: Record<string, string> = {};

  // Legacy key first, so an explicit meta attribute below overrides it.
  addValue(meta, "platform", dataset.swetrixPlatform);

  for (const [key, value] of Object.entries(dataset)) {
    if (!key.startsWith(META_PREFIX) || key.length === META_PREFIX.length) {
      continue;
    }
    const suffix = key.slice(META_PREFIX.length);
    addValue(meta, suffix[0].toLowerCase() + suffix.slice(1), value);
  }

  return Object.keys(meta).length > 0 ? meta : undefined;
}

function addValue(
  meta: Record<string, string>,
  key: string,
  value: string | undefined
): void {
  if (value === undefined) return;
  const trimmed = value.trim();
  if (trimmed.length === 0) return;
  meta[key] = trimmed.slice(0, MAX_VALUE_LENGTH);
}
