import { describe, expect, it } from "vitest";
import rehypeAffiliateLinks, {
  AFFILIATE_EVENT,
  parseAffiliateLink,
} from "./rehypeAffiliateLinks";

describe("parseAffiliateLink", () => {
  it("extracts ASIN and shop from a tagged Amazon link", () => {
    expect(
      parseAffiliateLink("https://www.amazon.de/dp/B0HJW4MVBJ?tag=example-21")
    ).toEqual({ asin: "B0HJW4MVBJ", shop: "amazon.de" });
  });

  it("reads the ASIN from long product URLs", () => {
    expect(
      parseAffiliateLink(
        "https://www.amazon.de/Some-Product-Name/dp/B0FKH3RLXV?psc=1&tag=example-21"
      )?.asin
    ).toBe("B0FKH3RLXV");
  });

  it("ignores Amazon links without a partner tag", () => {
    expect(
      parseAffiliateLink("https://www.amazon.de/dp/B0HJW4MVBJ")
    ).toBeUndefined();
  });

  it("ignores other hosts, look-alikes and relative links", () => {
    expect(parseAffiliateLink("https://example.com/?tag=x")).toBeUndefined();
    expect(
      parseAffiliateLink("https://amazon.de.example.com/dp/B0HJW4MVBJ?tag=x")
    ).toBeUndefined();
    expect(parseAffiliateLink("/posts/lets-get-serial")).toBeUndefined();
  });
});

describe("rehypeAffiliateLinks", () => {
  it("marks affiliate anchors and leaves other anchors untouched", () => {
    const affiliate = {
      type: "element",
      tagName: "a",
      properties: {
        href: "https://www.amazon.de/dp/B0HJW4MVBJ?tag=example-21",
      },
      children: [],
    };
    const plain = {
      type: "element",
      tagName: "a",
      properties: { href: "https://github.com/" },
      children: [],
    };
    const tree = {
      type: "root",
      children: [
        { type: "element", tagName: "p", children: [affiliate, plain] },
      ],
    };

    rehypeAffiliateLinks()(tree);

    expect(affiliate.properties).toMatchObject({
      rel: ["sponsored", "nofollow", "noopener"],
      target: "_blank",
      dataSwetrixEvent: AFFILIATE_EVENT,
      dataSwetrixMetaAsin: "B0HJW4MVBJ",
      dataSwetrixMetaShop: "amazon.de",
    });
    expect(plain.properties).toEqual({ href: "https://github.com/" });
  });
});
