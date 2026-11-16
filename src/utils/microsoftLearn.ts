import { z } from "astro/zod";

const api = "https://learn.microsoft.com/api";
const publicProfile = z.object({
  userId: z.uuid(),
  isPrivate: z.literal(false),
});
const count = z.int().nonnegative();
const achievements = z.object({
  currentLevel: count,
  totalXp: count,
  achievementCategories: z.object({ Modules: count, LearningPaths: count }),
});

export async function fetchMicrosoftLearnStats(request = fetch) {
  try {
    const signal = AbortSignal.timeout(5000);
    async function getJson(path: string): Promise<unknown> {
      const response = await request(`${api}/${path}`, { signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }

    const profile = publicProfile.safeParse(
      await getJson("profiles/alademann")
    );
    if (!profile.success) throw new Error("Private or invalid profile");

    const stats = achievements.safeParse(
      await getJson(`achievements/xp/${profile.data.userId}`)
    );
    if (!stats.success) throw new Error("Invalid achievement statistics");

    return {
      level: stats.data.currentLevel,
      xp: stats.data.totalXp,
      badges: stats.data.achievementCategories.Modules,
      trophies: stats.data.achievementCategories.LearningPaths,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    // eslint-disable-next-line no-console -- Report unavailable statistics in the build log.
    console.warn(`[Microsoft Learn] Could not load statistics (${reason})`);
    return null;
  }
}

let statsForBuild: ReturnType<typeof fetchMicrosoftLearnStats> | undefined;

export function getMicrosoftLearnStats() {
  return (statsForBuild ??= fetchMicrosoftLearnStats());
}
