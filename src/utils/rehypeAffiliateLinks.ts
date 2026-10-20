/**
 * Rehype plugin that marks Amazon affiliate links in Markdown content.
 *
 * Authors write plain Markdown links; every link to an Amazon shop that carries
 * a partner `tag` gets:
 * - `rel="sponsored nofollow noopener"`, as search engines and the Amazon
 *   Associates programme expect for paid links,
 * - `target="_blank"`,
 * - `data-swetrix-event="AFFILIATE_CLICK"` plus ASIN and shop meta, picked up by
 *   the delegated click tracking in `src/scripts/analytics-events.ts`.
 */

/** Minimal hast shapes; avoids a direct dependency on `@types/hast`. */
type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

export const AFFILIATE_EVENT = "AFFILIATE_CLICK";

/** Amazon storefronts such as amazon.de, amazon.com, amazon.co.uk, amazon.com.au. */
const AMAZON_HOST =
  /^(?:www\.)?amazon\.(?:[a-z]{2,3}|co\.[a-z]{2}|com\.[a-z]{2})$/i;
const ASIN_PATH = /\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?]|$)/i;

export type AffiliateLink = { asin?: string; shop: string };

/** Returns affiliate details for an Amazon partner link, otherwise `undefined`. */
export function parseAffiliateLink(href: string): AffiliateLink | undefined {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return undefined;
  }
  if (!AMAZON_HOST.test(url.hostname) || !url.searchParams.get("tag")) {
    return undefined;
  }
  const asin = ASIN_PATH.exec(url.pathname)?.[1]?.toUpperCase();
  return { asin, shop: url.hostname.replace(/^www\./, "") };
}

function visit(node: HastNode): void {
  if (node.type === "element" && node.tagName === "a") {
    const href = node.properties?.href;
    const link =
      typeof href === "string" ? parseAffiliateLink(href) : undefined;
    if (link) {
      node.properties = {
        ...node.properties,
        rel: ["sponsored", "nofollow", "noopener"],
        target: "_blank",
        dataSwetrixEvent: AFFILIATE_EVENT,
        dataSwetrixMetaShop: link.shop,
        ...(link.asin && { dataSwetrixMetaAsin: link.asin }),
      };
    }
  }
  node.children?.forEach(visit);
}

export default function rehypeAffiliateLinks() {
  return (tree: HastNode) => visit(tree);
}
