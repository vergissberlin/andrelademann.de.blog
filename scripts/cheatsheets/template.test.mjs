import { describe, expect, it } from "vitest";
import { escapeHtml, renderCheatSheet } from "./template.mjs";

/** Minimal sheet, extended per test. */
function sheet(overrides = {}) {
  return {
    slug: "a-post",
    fileName: "a.pdf",
    title: "A title",
    subtitle: "A subtitle",
    articleUrl: "blog.andrelademann.de/posts/a-post",
    pages: [{ blocks: [{ kind: "note", text: "Hello" }] }],
    ...overrides,
  };
}

describe("escapeHtml", () => {
  it("escapes the characters that can break out of markup", () => {
    expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;"
    );
  });
});

describe("renderCheatSheet", () => {
  it("renders one sheet element per page and numbers them", () => {
    const html = renderCheatSheet(
      sheet({
        pages: [
          { blocks: [{ kind: "note", text: "One" }] },
          { blocks: [{ kind: "note", text: "Two" }] },
        ],
      })
    );

    expect(html.match(/class="sheet"/g)).toHaveLength(2);
    expect(html).toContain("1 / 2");
    expect(html).toContain("2 / 2");
  });

  it("omits the page counter on a single-page sheet", () => {
    expect(renderCheatSheet(sheet())).not.toMatch(/\d \/ \d/);
  });

  it("escapes content before applying markup, so data cannot inject HTML", () => {
    const html = renderCheatSheet(
      sheet({
        pages: [
          {
            blocks: [
              { kind: "note", text: "<script>alert(1)</script> **bold**" },
            ],
          },
        ],
      })
    );

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("<strong>bold</strong>");
  });

  it("renders inline code spans", () => {
    const html = renderCheatSheet(
      sheet({
        pages: [{ blocks: [{ kind: "note", text: "Run `npm audit` first" }] }],
      })
    );

    expect(html).toContain('<code class="inline">npm audit</code>');
  });

  it("uses the requested page size in both the @page rule and the box", () => {
    const html = renderCheatSheet(sheet({ pageSize: "A5" }));

    expect(html).toContain("@page { size: A5;");
    expect(html).toContain("width: 148mm");
    expect(html).toContain("height: 210mm");
  });

  it("defaults to A4 for an unknown page size rather than rendering a broken box", () => {
    const html = renderCheatSheet(sheet({ pageSize: "A9" }));

    expect(html).toContain("width: 210mm");
    expect(html).toContain("height: 297mm");
  });

  it("appends the sources to the last page only", () => {
    const html = renderCheatSheet(
      sheet({
        pages: [
          { blocks: [{ kind: "note", text: "One" }] },
          { blocks: [{ kind: "note", text: "Two" }] },
        ],
        sources: [{ title: "A source", url: "https://example.com/a" }],
      })
    );

    expect(html.match(/class="sources"/g)).toHaveLength(1);
    expect(html.indexOf("class=\"sources\"")).toBeGreaterThan(
      html.lastIndexOf('<article class="sheet">')
    );
  });

  it("throws on an unknown block kind rather than silently dropping it", () => {
    expect(() =>
      renderCheatSheet(
        sheet({ pages: [{ blocks: [{ kind: "carousel", items: [] }] }] })
      )
    ).toThrow(/Unknown cheat sheet block kind: carousel/);
  });

  it("renders a rating scale instead of a tick box when asked", () => {
    const withScale = renderCheatSheet(
      sheet({
        pages: [
          {
            blocks: [
              {
                kind: "checklist",
                scale: true,
                items: [{ term: "Area", detail: "Detail" }],
              },
            ],
          },
        ],
      })
    );

    expect(withScale).toContain('<span class="scale"');
    expect(withScale).not.toContain('<span class="box"');
  });
});
