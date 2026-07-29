export type DownloadInput = {
  /** Root-relative path inside `public/`, e.g. "/downloads/<slug>/file.pdf". */
  file: string;
  title: string;
  /** Optional one-line pitch shown under the title. */
  description?: string;
  /** Display label for the format. Derived from the extension when absent. */
  fileType?: string;
  /** Size in bytes. Resolved from disk at build time when absent. */
  fileSize?: number;
  /** Override for the `download` attribute. Defaults to the basename of `file`. */
  fileName?: string;
};

export type ResolvedDownload = {
  /** Root-relative path, not yet prefixed with the Astro `base`. */
  href: string;
  fileName: string;
  title: string;
  description?: string;
  fileType?: string;
  /** MIME type for the `type` attribute; `undefined` for unknown extensions. */
  mimeType?: string;
  /** Human-readable format and size, e.g. "PDF · 829 kB". */
  metaLabel?: string;
};

const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  zip: "application/zip",
  csv: "text/csv",
  json: "application/json",
  md: "text/markdown",
  txt: "text/plain",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
};

/**
 * Normalise a path pointing at a file in `public/`.
 *
 * Guarantees exactly one leading slash and strips any query or hash. Rejects
 * off-site and non-relative paths: the `download` attribute is silently ignored
 * cross-origin, which would navigate the reader away instead of handing them a
 * file. Returns `undefined` when the path is unusable.
 */
export function normaliseDownloadPath(file: string): string | undefined {
  const trimmed = file.trim();
  if (trimmed.length === 0) return undefined;

  // Protocol-relative ("//host") and absolute URLs both point off-site. Three
  // or more slashes leave the authority empty, so they stay same-origin.
  if (/^\/\/[^/]/.test(trimmed)) return undefined;
  try {
    new URL(trimmed);
    return undefined;
  } catch {
    // Not an absolute URL — which is what we want here.
  }

  const withoutSuffix = trimmed.split(/[?#]/, 1)[0];
  const withoutLeadingSlashes = withoutSuffix.replace(/^\/+/, "");
  return withoutLeadingSlashes.length > 0
    ? `/${withoutLeadingSlashes}`
    : undefined;
}

/**
 * Extract the lowercased extension of a path, without the dot.
 * Returns `undefined` when there is none, or for dotfiles.
 */
export function getDownloadExtension(file: string): string | undefined {
  const basename = file.split("/").pop() ?? "";
  const dot = basename.lastIndexOf(".");
  if (dot < 1 || dot === basename.length - 1) return undefined;
  return basename.slice(dot + 1).toLowerCase();
}

/**
 * Resolve the name offered to the browser's save dialogue.
 *
 * Uses the trimmed override when given, with path separators stripped so
 * frontmatter cannot smuggle a traversal into the `download` attribute.
 */
export function getDownloadFileName(
  file: string,
  override?: string
): string | undefined {
  const candidate = override?.trim() ? override.trim() : file;
  const basename = candidate.split(/[/\\]/).pop()?.trim();
  return basename && basename.length > 0 ? basename : undefined;
}

/**
 * Map a path's extension to a MIME type.
 * Returns `undefined` for unknown extensions, so callers can omit the attribute
 * rather than emit a wrong one.
 */
export function getDownloadMimeType(file: string): string | undefined {
  const extension = getDownloadExtension(file);
  return extension ? MIME_TYPES[extension] : undefined;
}

/**
 * Format a byte count the way a file manager does, using decimal units.
 *
 * Returns `undefined` for missing, zero, negative, or non-finite sizes — a
 * zero-byte offer is a bug, not a fact worth announcing.
 */
export function formatFileSize(bytes?: number): string | undefined {
  if (bytes === undefined || !Number.isFinite(bytes) || bytes <= 0) {
    return undefined;
  }
  if (bytes < 1_000) return `${Math.round(bytes)} B`;
  if (bytes < 1_000_000) return `${Math.round(bytes / 1_000)} kB`;
  // Fixed formatting rather than Intl, so the decimal separator cannot drift
  // with the environment's locale.
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

/**
 * Join the format and size into one label, dropping whichever part is unknown.
 */
export function formatDownloadMeta(
  fileType?: string,
  fileSize?: number
): string | undefined {
  const parts = [fileType?.trim(), formatFileSize(fileSize)].filter(
    (part): part is string => Boolean(part && part.length > 0)
  );
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

/**
 * Validate and enrich a download for rendering.
 *
 * Returns `undefined` when the file path or title is unusable, so the component
 * can render nothing rather than a broken link.
 */
export function resolveDownload(
  input: DownloadInput
): ResolvedDownload | undefined {
  const href = normaliseDownloadPath(input.file);
  if (!href) return undefined;

  const title = input.title.trim();
  if (title.length === 0) return undefined;

  const fileName = getDownloadFileName(href, input.fileName);
  if (!fileName) return undefined;

  const extension = getDownloadExtension(href);
  const fileType = input.fileType?.trim() || extension?.toUpperCase();
  const description = input.description?.trim() || undefined;

  return {
    href,
    fileName,
    title,
    ...(description ? { description } : {}),
    ...(fileType ? { fileType } : {}),
    ...(getDownloadMimeType(href)
      ? { mimeType: getDownloadMimeType(href) }
      : {}),
    ...(formatDownloadMeta(fileType, input.fileSize)
      ? { metaLabel: formatDownloadMeta(fileType, input.fileSize) }
      : {}),
  };
}
