import { z } from "astro/zod";

export const credlyProfileUrl =
  "https://www.credly.com/users/andre-lademann/badges/credly";
const badgeFeed = "https://www.credly.com/users/andre-lademann/badges.json";

const badgePage = z.object({
  data: z.array(
    z.looseObject({
      public: z.boolean(),
      is_private_badge: z.boolean().optional(),
    })
  ),
  metadata: z.object({
    current_page: z.int().positive(),
    total_pages: z.int().nonnegative(),
  }),
});
const publicBadge = z.object({
  id: z.uuid(),
  image_url: z.string().startsWith("https://images.credly.com/").nullish(),
  issued_at_date: z.iso.date(),
  expires_at_date: z.iso.date().nullish(),
  issuer: z.object({
    entities: z.array(
      z.object({
        primary: z.boolean(),
        entity: z.object({ name: z.string().trim().min(1) }),
      })
    ),
  }),
  badge_template: z.object({
    name: z.string().trim().min(1),
    type_category: z.string().nullish(),
  }),
});

export async function fetchCredlyBadges(request = fetch) {
  try {
    const signal = AbortSignal.timeout(8000);
    const badges = new Map<string, z.infer<typeof publicBadge>>();
    let totalPages = 1;

    for (let page = 1; page <= totalPages; page++) {
      const response = await request(`${badgeFeed}?page=${page}`, { signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const { data, metadata } = badgePage.parse(await response.json());
      if (metadata.current_page !== page) throw new Error("Unexpected page");
      totalPages = page === 1 ? metadata.total_pages : totalPages;

      for (const entry of data) {
        if (!entry.public || entry.is_private_badge === true) continue;
        const badge = publicBadge.parse(entry);
        badges.set(badge.id, badge);
      }
    }

    return [...badges.values()].map(badge => ({
      title: badge.badge_template.name,
      category: badge.badge_template.type_category,
      issuer:
        badge.issuer.entities.find(({ primary }) => primary)?.entity.name ??
        badge.issuer.entities[0]?.entity.name,
      imageUrl: badge.image_url,
      issuedOn: badge.issued_at_date,
      expiresOn: badge.expires_at_date,
      verificationUrl: `https://www.credly.com/badges/${badge.id}/public_url`,
    }));
  } catch (error) {
    const reason =
      error instanceof z.ZodError
        ? "Invalid badge feed"
        : error instanceof Error
          ? error.message
          : "Unknown error";
    // eslint-disable-next-line no-console -- Report unavailable badges in the build log.
    console.warn(`[Credly] Could not load public badges (${reason})`);
    return [];
  }
}

let badgesForBuild: ReturnType<typeof fetchCredlyBadges> | undefined;

export function getCredlyBadges() {
  return (badgesForBuild ??= fetchCredlyBadges());
}
