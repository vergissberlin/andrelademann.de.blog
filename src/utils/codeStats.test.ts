import { expect, it, vi } from "vitest";
import { fetchCodeStats } from "./codeStats";

const user = "vergissberlin";

it("calculates the level and ranks the five formats with the most XP", async () => {
  const request = vi.fn<typeof fetch>().mockResolvedValue(
    Response.json({
      user,
      total_xp: 6400,
      languages: {
        Go: { xps: 300 },
        Markdown: { xps: 1200 },
        JavaScript: { xps: 1000 },
        Vue: { xps: 300 },
        HTML: { xps: 600 },
        YAML: { xps: 1100 },
      },
    })
  );

  expect(await fetchCodeStats(request)).toMatchObject({
    totalXp: 6400,
    level: 2,
    topLanguages: [
      { name: "Markdown", xp: 1200 },
      { name: "YAML", xp: 1100 },
      { name: "JavaScript", xp: 1000 },
      { name: "HTML", xp: 600 },
      { name: "Go", xp: 300 },
    ],
  });
});

it("accepts an empty profile at level zero", async () => {
  const request = vi.fn<typeof fetch>().mockResolvedValue(
    Response.json({
      user,
      total_xp: 0,
      languages: { Go: { xps: 0 } },
    })
  );

  expect(await fetchCodeStats(request)).toMatchObject({
    totalXp: 0,
    level: 0,
    topLanguages: [],
  });
});

it("falls back when the public endpoint is unavailable", async () => {
  const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
  try {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 404 }));
    expect(await fetchCodeStats(request)).toBeNull();
    expect(warning).toHaveBeenCalledWith(expect.stringContaining("HTTP 404"));
  } finally {
    warning.mockRestore();
  }
});
