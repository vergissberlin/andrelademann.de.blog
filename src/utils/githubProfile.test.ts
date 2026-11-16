import { expect, it } from "vitest";
import {
  parseGitHubAchievements,
  parseGitHubContributions,
} from "./githubProfile";

it("extracts GitHub's trailing-year total and the day's calendar position", () => {
  expect(
    parseGitHubContributions(`
    <h2 id="js-contribution-activity-description">
      11,312 contributions in the last year
    </h2>
    <table><tr><td data-date="2026-11-16" data-ix="52" data-level="3"></td></tr></table>
  `)
  ).toEqual({
    total: 11312,
    days: [{ date: "2026-11-16", week: 52, weekday: 1, level: 3 }],
  });
  expect(() =>
    parseGitHubContributions("<h2>Profile unavailable</h2>")
  ).toThrow("Missing contribution total");
});

it("extracts public achievement cards, including the displayed tier", () => {
  const imageUrl = "https://github.githubassets.com/assets/pull-shark.png";
  expect(
    parseGitHubAchievements(`
    <img src="${imageUrl}" alt="Achievement: Duplicate sidebar item">
    <details data-achievement-slug="pull-shark">
      <summary>
        <img src="${imageUrl}" alt="Achievement: Pull Shark">
        <span class="Label achievement-tier-label">x4</span>
      </summary>
    </details>
    <details data-achievement-slug="spoof">
      <summary><img src="https://example.com/badge.png" alt="Achievement: Spoof"></summary>
    </details>
  `)
  ).toEqual([
    {
      title: "Pull Shark",
      tier: "x4",
      imageUrl,
      url: "https://github.com/vergissberlin?achievement=pull-shark&tab=achievements",
    },
  ]);
});
