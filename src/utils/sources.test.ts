import { describe, expect, it } from "vitest";
import {
  formatSourceNote,
  getSourceHostname,
  normaliseSources,
  type Source,
} from "./sources";

describe("normaliseSources", () => {
  it("filters items with empty titles or urls", () => {
    const items: Source[] = [
      { title: "Keep me", url: "https://example.com/a" },
      { title: "   ", url: "https://example.com/b" },
      { title: "No url", url: "" },
      { title: "Also keep", url: "  https://example.com/c  " },
    ];

    expect(normaliseSources(items)).toEqual([
      { title: "Keep me", url: "https://example.com/a" },
      { title: "Also keep", url: "  https://example.com/c  " },
    ]);
  });

  it("preserves relative order of valid items", () => {
    const items: Source[] = [
      { title: "First", url: "https://example.com/1" },
      { title: "", url: "https://example.com/skip" },
      { title: "Second", url: "https://example.com/2" },
      { title: "Third", url: "https://example.com/3" },
    ];

    expect(normaliseSources(items).map(s => s.title)).toEqual([
      "First",
      "Second",
      "Third",
    ]);
  });
});

describe("formatSourceNote", () => {
  it("returns undefined for missing or blank notes", () => {
    expect(formatSourceNote()).toBeUndefined();
    expect(formatSourceNote("")).toBeUndefined();
    expect(formatSourceNote("   ")).toBeUndefined();
  });

  it("trims a present note", () => {
    expect(formatSourceNote("  Ars Technica, June 2026  ")).toBe(
      "Ars Technica, June 2026"
    );
  });
});

describe("getSourceHostname", () => {
  it("extracts hostname and strips www", () => {
    expect(getSourceHostname("https://www.arstechnica.com/ai/2026/06/x/")).toBe(
      "arstechnica.com"
    );
    expect(getSourceHostname("http://example.org/path")).toBe("example.org");
  });

  it("returns undefined for invalid or non-http URLs", () => {
    expect(getSourceHostname("not-a-url")).toBeUndefined();
    expect(getSourceHostname("ftp://files.example.com/a")).toBeUndefined();
  });
});
