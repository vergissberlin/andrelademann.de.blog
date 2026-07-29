import { describe, expect, it } from "vitest";
import {
  formatDownloadMeta,
  formatFileSize,
  getDownloadExtension,
  getDownloadFileName,
  getDownloadMimeType,
  normaliseDownloadPath,
  resolveDownload,
} from "./download";

describe("normaliseDownloadPath", () => {
  it("normalises a public path to a single leading slash", () => {
    expect(normaliseDownloadPath("downloads/a/b.pdf")).toBe(
      "/downloads/a/b.pdf"
    );
    expect(normaliseDownloadPath("///downloads/a/b.pdf")).toBe(
      "/downloads/a/b.pdf"
    );
    expect(normaliseDownloadPath("  /downloads/a/b.pdf  ")).toBe(
      "/downloads/a/b.pdf"
    );
  });

  it("returns undefined for blank paths", () => {
    expect(normaliseDownloadPath("")).toBeUndefined();
    expect(normaliseDownloadPath("   ")).toBeUndefined();
    expect(normaliseDownloadPath("/")).toBeUndefined();
  });

  it("rejects off-site and protocol-relative paths", () => {
    expect(normaliseDownloadPath("https://evil.example/x.pdf")).toBeUndefined();
    expect(normaliseDownloadPath("//evil.example/x.pdf")).toBeUndefined();
    expect(normaliseDownloadPath("javascript:alert(1)")).toBeUndefined();
  });

  it("strips query and hash", () => {
    expect(normaliseDownloadPath("/a/b.pdf?v=2#page=1")).toBe("/a/b.pdf");
  });
});

describe("getDownloadExtension", () => {
  it("extracts a lowercased extension", () => {
    expect(getDownloadExtension("/a/File.PDF")).toBe("pdf");
    expect(getDownloadExtension("/a/b.tar.gz")).toBe("gz");
  });

  it("returns undefined when there is no extension", () => {
    expect(getDownloadExtension("/a/file")).toBeUndefined();
    expect(getDownloadExtension("/a/.hidden")).toBeUndefined();
    expect(getDownloadExtension("/a/trailing.")).toBeUndefined();
  });
});

describe("getDownloadFileName", () => {
  it("derives the file name from the path", () => {
    expect(getDownloadFileName("/downloads/x/okr-cheatsheet.pdf")).toBe(
      "okr-cheatsheet.pdf"
    );
  });

  it("prefers a trimmed override", () => {
    expect(getDownloadFileName("/a/b.pdf", "  custom.pdf ")).toBe("custom.pdf");
  });

  it("strips path separators from an override", () => {
    expect(getDownloadFileName("/a/b.pdf", "../../etc/passwd")).toBe("passwd");
  });

  it("falls back to the path when the override is blank", () => {
    expect(getDownloadFileName("/a/b.pdf", "   ")).toBe("b.pdf");
  });

  it("returns undefined for a path with no basename", () => {
    expect(getDownloadFileName("/")).toBeUndefined();
  });
});

describe("getDownloadMimeType", () => {
  it("maps known extensions to MIME types", () => {
    expect(getDownloadMimeType("/a/b.pdf")).toBe("application/pdf");
    expect(getDownloadMimeType("/a/b.zip")).toBe("application/zip");
    expect(getDownloadMimeType("/a/b.JPEG")).toBe("image/jpeg");
  });

  it("returns undefined for unknown extensions", () => {
    expect(getDownloadMimeType("/a/b.xyz")).toBeUndefined();
    expect(getDownloadMimeType("/a/b")).toBeUndefined();
  });
});

describe("formatFileSize", () => {
  it("formats megabytes with one decimal", () => {
    expect(formatFileSize(828809)).toBe("829 kB");
    expect(formatFileSize(5938034)).toBe("5.9 MB");
  });

  it("formats small sizes in bytes", () => {
    expect(formatFileSize(512)).toBe("512 B");
  });

  it("returns undefined for missing, zero, or invalid sizes", () => {
    expect(formatFileSize()).toBeUndefined();
    expect(formatFileSize(0)).toBeUndefined();
    expect(formatFileSize(-1)).toBeUndefined();
    expect(formatFileSize(Number.NaN)).toBeUndefined();
    expect(formatFileSize(Number.POSITIVE_INFINITY)).toBeUndefined();
  });
});

describe("formatDownloadMeta", () => {
  it("joins type and size", () => {
    expect(formatDownloadMeta("PDF", 828809)).toBe("PDF · 829 kB");
  });

  it("falls back to whichever part is present", () => {
    expect(formatDownloadMeta("PDF", undefined)).toBe("PDF");
    expect(formatDownloadMeta(undefined, 828809)).toBe("829 kB");
  });

  it("returns undefined when neither is known", () => {
    expect(formatDownloadMeta()).toBeUndefined();
    expect(formatDownloadMeta("  ", 0)).toBeUndefined();
  });
});

describe("resolveDownload", () => {
  it("resolves a complete download", () => {
    expect(
      resolveDownload({
        file: "/downloads/okr/cheatsheet.pdf",
        title: "  OKR cheat sheet  ",
        description: "  One page, all eight mistakes.  ",
        fileType: "PDF",
        fileSize: 828809,
      })
    ).toEqual({
      href: "/downloads/okr/cheatsheet.pdf",
      fileName: "cheatsheet.pdf",
      title: "OKR cheat sheet",
      description: "One page, all eight mistakes.",
      fileType: "PDF",
      mimeType: "application/pdf",
      metaLabel: "PDF · 829 kB",
    });
  });

  it("derives fileType from the extension when absent", () => {
    const resolved = resolveDownload({
      file: "/downloads/okr/cheatsheet.pdf",
      title: "OKR cheat sheet",
      fileSize: 828809,
    });

    expect(resolved?.fileType).toBe("PDF");
    expect(resolved?.metaLabel).toBe("PDF · 829 kB");
  });

  it("omits optional fields that cannot be derived", () => {
    expect(
      resolveDownload({ file: "/downloads/notes.xyz", title: "Notes" })
    ).toEqual({
      href: "/downloads/notes.xyz",
      fileName: "notes.xyz",
      title: "Notes",
      fileType: "XYZ",
      metaLabel: "XYZ",
    });
  });

  it("returns undefined for a blank title or an invalid file", () => {
    expect(resolveDownload({ file: "/a/b.pdf", title: "   " })).toBeUndefined();
    expect(resolveDownload({ file: "", title: "X" })).toBeUndefined();
    expect(
      resolveDownload({ file: "https://evil.example/x.pdf", title: "X" })
    ).toBeUndefined();
  });
});
