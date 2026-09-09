import { describe, expect, it } from "vitest";
import userConfig from "../astro-paper.config";

describe("share links", () => {
  it("includes the daily.dev article share URL", () => {
    expect(userConfig.shareLinks).toContainEqual({
      name: "dailydev",
      url: "https://daily.dev/",
      linkTitle: "Share this post on daily.dev",
    });
  });
});
