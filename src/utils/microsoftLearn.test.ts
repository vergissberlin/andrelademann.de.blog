import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchMicrosoftLearnStats,
  getMicrosoftLearnStats,
} from "./microsoftLearn";

const userId = "8fe44703-8b42-4a66-913b-bff959992c54";
const profile = { userId, isPrivate: false };
const achievements = {
  currentLevel: 7,
  totalXp: 42150,
  achievementCategories: { Modules: 26, LearningPaths: 2 },
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Microsoft Learn statistics", () => {
  it("shares a single profile and statistics request between both pages", async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json(profile))
      .mockResolvedValueOnce(Response.json(achievements));
    vi.stubGlobal("fetch", request);

    const first = getMicrosoftLearnStats();
    expect(getMicrosoftLearnStats()).toBe(first);
    expect(await first).toEqual({
      level: 7,
      xp: 42150,
      badges: 26,
      trophies: 2,
      fetchedAt: expect.any(String),
    });
    expect(request.mock.calls.map(([url]) => url)).toEqual([
      "https://learn.microsoft.com/api/profiles/alademann",
      `https://learn.microsoft.com/api/achievements/xp/${userId}`,
    ]);
  });

  it("accepts zero counts", async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json(profile))
      .mockResolvedValueOnce(
        Response.json({
          currentLevel: 0,
          totalXp: 0,
          achievementCategories: { Modules: 0, LearningPaths: 0 },
        })
      );

    expect(await fetchMicrosoftLearnStats(request)).toMatchObject({
      level: 0,
      xp: 0,
      badges: 0,
      trophies: 0,
    });
  });

  it("skips achievements when the profile is private", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ ...profile, isPrivate: true }));

    expect(await fetchMicrosoftLearnStats(request)).toBeNull();
    expect(request).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Private"));
  });

  it.each([-1, 1.5, "42", undefined])(
    "rejects an invalid XP value (%s)",
    async totalXp => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const request = vi
        .fn<typeof fetch>()
        .mockResolvedValueOnce(Response.json(profile))
        .mockResolvedValueOnce(Response.json({ ...achievements, totalXp }));

      expect(await fetchMicrosoftLearnStats(request)).toBeNull();
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("Invalid achievement")
      );
    }
  );

  it("falls back when the request times out", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const request = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(
        new DOMException("Request timed out", "TimeoutError")
      );

    expect(await fetchMicrosoftLearnStats(request)).toBeNull();
    expect(request).toHaveBeenCalledWith(expect.any(String), {
      signal: expect.any(AbortSignal),
    });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("timed out"));
  });
});
