import { expect, it, vi } from "vitest";
import { fetchCredlyBadges } from "./credly";

const badge = {
  id: "20000000-0000-4000-8000-000000000001",
  public: true,
  issued_at_date: "2026-01-11",
  issuer: {
    entities: [
      { primary: false, entity: { name: "Partner" } },
      { primary: true, entity: { name: "Issuer" } },
    ],
  },
  badge_template: { name: "Associate", type_category: "Certification" },
};

function page(current: number, data: unknown[]) {
  return Response.json({
    data,
    metadata: { current_page: current, total_pages: 2 },
  });
}

it("collects unique public credentials across all Credly pages", async () => {
  const course = {
    ...badge,
    id: "20000000-0000-4000-8000-000000000002",
    badge_template: { name: "Essentials", type_category: "Learning" },
  };
  const request = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(page(1, [badge, { public: false }]))
    .mockResolvedValueOnce(page(2, [badge, course]));

  expect(await fetchCredlyBadges(request)).toMatchObject([
    {
      title: "Associate",
      issuer: "Issuer",
      category: "Certification",
      verificationUrl: `https://www.credly.com/badges/${badge.id}/public_url`,
    },
    { title: "Essentials", category: "Learning" },
  ]);
  expect(request).toHaveBeenCalledTimes(2);
  expect(request.mock.calls[1][0]).toMatch(/\?page=2$/);
});

it("falls back to the profile link when a later page is unavailable", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  try {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(page(1, [badge]))
      .mockResolvedValueOnce(new Response(null, { status: 503 }));

    expect(await fetchCredlyBadges(request)).toEqual([]);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("HTTP 503"));
  } finally {
    warn.mockRestore();
  }
});
