import { fromHtml } from "hast-util-from-html";
import { visit } from "unist-util-visit";

const username = "vergissberlin";
export const githubProfileUrl = `https://github.com/${username}`;
export const githubAchievementsUrl = `${githubProfileUrl}?tab=achievements`;
const contributionsUrl = `https://github.com/users/${username}/contributions`;

export function parseGitHubContributions(html: string) {
  let total: number | undefined;
  const days: { date: string; week: number; weekday: number; level: number }[] =
    [];

  visit(fromHtml(html), "element", node => {
    const { id, dataDate, dataIx, dataLevel } = node.properties;

    if (id === "js-contribution-activity-description") {
      const heading = node.children.find(child => child.type === "text")?.value;
      const count = heading?.trim().match(/^([\d,]+)\s+contributions?\b/i)?.[1];
      if (count) total = Number(count.replaceAll(",", ""));
    }

    if (
      node.tagName === "td" &&
      typeof dataDate === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(dataDate) &&
      typeof dataIx === "string" &&
      /^\d{1,2}$/.test(dataIx) &&
      typeof dataLevel === "string" &&
      /^[0-4]$/.test(dataLevel)
    ) {
      const weekday = new Date(`${dataDate}T00:00:00Z`).getUTCDay();
      if (Number.isInteger(weekday)) {
        days.push({
          date: dataDate,
          week: Number(dataIx),
          weekday,
          level: Number(dataLevel),
        });
      }
    }
  });

  if (total === undefined || !Number.isSafeInteger(total)) {
    throw new Error("Missing contribution total");
  }

  return { total, days };
}

export function parseGitHubAchievements(html: string) {
  const achievements: {
    title: string;
    imageUrl: string;
    url: string;
    tier?: string;
  }[] = [];

  visit(fromHtml(html), "element", node => {
    const slug = node.properties.dataAchievementSlug;
    if (
      node.tagName !== "details" ||
      typeof slug !== "string" ||
      !/^[a-z0-9-]+$/.test(slug)
    ) {
      return;
    }
    const summary = node.children.find(
      child => child.type === "element" && child.tagName === "summary"
    );
    if (!summary || summary.type !== "element") return;
    let title: string | undefined;
    let imageUrl: string | undefined;
    let tier: string | undefined;

    visit(summary, "element", child => {
      const { alt, src, className } = child.properties;
      if (
        child.tagName === "img" &&
        typeof src === "string" &&
        src.startsWith("https://github.githubassets.com/assets/") &&
        typeof alt === "string" &&
        alt.startsWith("Achievement: ")
      ) {
        title = alt.slice("Achievement: ".length).trim();
        imageUrl = src;
      }
      if (
        Array.isArray(className) &&
        className.includes("achievement-tier-label")
      ) {
        const label = child.children
          .find(entry => entry.type === "text")
          ?.value.trim();
        if (label && /^x\d+$/.test(label)) tier = label;
      }
    });

    if (title && imageUrl) {
      const url = `${githubProfileUrl}?achievement=${slug}&tab=achievements`;
      achievements.push({ title, imageUrl, url, tier });
    }
  });

  return achievements;
}

async function load<T>(url: string, parse: (html: string) => T) {
  try {
    const response = await fetch(url, {
      headers: { "Accept-Language": "en" },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return parse(await response.text());
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    // eslint-disable-next-line no-console -- Report unavailable profile data in the build log.
    console.warn(`[GitHub] Could not load ${url} (${reason})`);
    return null;
  }
}

let profileForBuild:
  | Promise<
      [
        ReturnType<typeof parseGitHubContributions> | null,
        ReturnType<typeof parseGitHubAchievements> | null,
      ]
    >
  | undefined;

export function getGitHubProfile() {
  return (profileForBuild ??= Promise.all([
    load(contributionsUrl, parseGitHubContributions),
    load(githubAchievementsUrl, parseGitHubAchievements),
  ]));
}
