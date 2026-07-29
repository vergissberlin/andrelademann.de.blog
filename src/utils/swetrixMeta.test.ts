import { describe, expect, it } from "vitest";
import { readSwetrixMeta } from "./swetrixMeta";

describe("readSwetrixMeta", () => {
  it("returns undefined when no meta attributes are present", () => {
    expect(readSwetrixMeta({})).toBeUndefined();
    expect(readSwetrixMeta({ swetrixEvent: "DOWNLOAD_CLICK" })).toBeUndefined();
  });

  it("reads the legacy platform attribute", () => {
    expect(readSwetrixMeta({ swetrixPlatform: "linkedin" })).toEqual({
      platform: "linkedin",
    });
  });

  it("camel-cases generic meta keys", () => {
    expect(
      readSwetrixMeta({
        swetrixMetaFile: "cheatsheet.pdf",
        swetrixMetaFileType: "PDF",
      })
    ).toEqual({ file: "cheatsheet.pdf", fileType: "PDF" });
  });

  it("lets an explicit meta key override the legacy platform attribute", () => {
    expect(
      readSwetrixMeta({
        swetrixPlatform: "old",
        swetrixMetaPlatform: "new",
      })
    ).toEqual({ platform: "new" });
  });

  it("drops blank values and trims the rest", () => {
    expect(
      readSwetrixMeta({
        swetrixMetaFile: "  cheatsheet.pdf  ",
        swetrixMetaOther: "   ",
        swetrixPlatform: "",
      })
    ).toEqual({ file: "cheatsheet.pdf" });
  });

  it("truncates long values", () => {
    const meta = readSwetrixMeta({ swetrixMetaFile: "x".repeat(500) });
    expect(meta?.file).toHaveLength(100);
  });

  it("ignores the bare prefix", () => {
    expect(readSwetrixMeta({ swetrixMeta: "x" })).toBeUndefined();
  });
});
