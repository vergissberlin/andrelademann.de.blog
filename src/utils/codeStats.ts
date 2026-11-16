import { z } from "astro/zod";

export const codeStatsProfileUrl = "https://codestats.net/users/vergissberlin";
const api = "https://codestats.net/api/users/vergissberlin";
const xp = z.int().nonnegative();
const profile = z.object({
  user: z.literal("vergissberlin"),
  total_xp: xp,
  languages: z.record(z.string(), z.object({ xps: xp })),
});

export async function fetchCodeStats(request = fetch) {
  try {
    const response = await request(api, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = profile.safeParse(await response.json());
    if (!result.success) throw new Error("Invalid profile data");

    const { total_xp: totalXp, languages } = result.data;
    const topLanguages = Object.entries(languages)
      .map(([name, { xps }]) => ({ name, xp: xps }))
      .filter(language => language.xp > 0)
      .sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name, "en"))
      .slice(0, 5);

    return {
      totalXp,
      level: Math.floor(0.025 * Math.sqrt(totalXp)),
      topLanguages,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    // eslint-disable-next-line no-console -- Report unavailable statistics in the build log.
    console.warn(`[Code::Stats] Could not load statistics (${reason})`);
    return null;
  }
}

let statsForBuild: ReturnType<typeof fetchCodeStats> | undefined;

export function getCodeStats() {
  return (statsForBuild ??= fetchCodeStats());
}
