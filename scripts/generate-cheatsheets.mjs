/**
 * Renders the printable cheat sheets in scripts/cheatsheets/sheets/ to PDFs under
 * public/downloads/<post-slug>/.
 *
 * Run: pnpm cheatsheets
 *
 * Deliberately NOT part of `pnpm build`. The PDFs are committed, so the site
 * build and the deploy never need a browser — and CI never has to install one,
 * which is why the dependency is `playwright-core` (no postinstall download)
 * rather than `playwright`.
 *
 * Point it at a Chromium with CHROME_PATH, or let it find one under
 * PLAYWRIGHT_BROWSERS_PATH.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { renderCheatSheet } from "./cheatsheets/template.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sheetsDir = join(__dirname, "cheatsheets", "sheets");

const FONT_CSS_URL =
  "https://fonts.googleapis.com/css2?family=Google+Sans+Code:wght@400;700&display=swap";

// Google serves woff2 only to browsers it recognises; Node's default agent gets
// ttf, which is several times larger for the same glyphs.
const MODERN_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

/**
 * Build @font-face rules with the font embedded as a data URI, so the rendered
 * PDF carries the blog's typeface regardless of what is installed locally.
 *
 * Only the basic latin subset is embedded — the sheets are English, and pulling
 * every subset would multiply the size for glyphs no sheet uses.
 */
async function loadFontCss() {
  const css = await fetch(FONT_CSS_URL, {
    headers: { "User-Agent": MODERN_UA },
  }).then(res => {
    if (!res.ok) {
      throw new Error(`Could not fetch the font stylesheet: HTTP ${res.status}`);
    }
    return res.text();
  });

  const blocks = css
    .split("@font-face")
    .slice(1)
    .map(block => ({
      weight: block.match(/font-weight:\s*(\d+)/)?.[1],
      url: block.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/)?.[1],
      // The latin subset is the block whose range opens at U+0000-00FF.
      isLatin: /unicode-range:\s*U\+0000-00FF/.test(block),
    }))
    .filter(block => block.isLatin && block.weight && block.url);

  if (blocks.length === 0) {
    throw new Error(
      "Could not resolve any latin woff2 face for Google Sans Code."
    );
  }

  const faces = await Promise.all(
    blocks.map(async block => {
      const data = await fetch(block.url).then(res => res.arrayBuffer());
      const base64 = Buffer.from(data).toString("base64");
      return `@font-face {
  font-family: "Google Sans Code";
  font-style: normal;
  font-weight: ${block.weight};
  src: url(data:font/woff2;base64,${base64}) format("woff2");
}`;
    })
  );

  return faces.join("\n");
}

/** Page objects in the PDF body. `/Type /Pages` is the tree node, not a page. */
function countPdfPages(pdf) {
  return (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
}

/** Chromium's PDFs embed a timestamp, which would rewrite every file on every run. */
function withoutTimestamps(pdf) {
  return pdf
    .toString("latin1")
    .replace(/\/(CreationDate|ModDate)\s*\([^)]*\)/g, "/$1 ()");
}

function resolveChromium() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;

  const browsersPath = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!browsersPath || !existsSync(browsersPath)) return undefined;

  const candidate = readdirSync(browsersPath)
    .filter(entry => entry.startsWith("chromium-"))
    .sort()
    .reverse()
    .map(entry => join(browsersPath, entry, "chrome-linux", "chrome"))
    .find(existsSync);

  return candidate;
}

async function loadSheets() {
  const files = readdirSync(sheetsDir)
    .filter(name => name.endsWith(".mjs"))
    .sort();

  return Promise.all(
    files.map(async name => {
      const module = await import(join(sheetsDir, name));
      return module.default;
    })
  );
}

const executablePath = resolveChromium();
if (!executablePath) {
  console.error(
    "No Chromium found. Set CHROME_PATH to a Chromium or Chrome binary, or\n" +
      "PLAYWRIGHT_BROWSERS_PATH to a directory containing chromium-<build>/chrome-linux/chrome."
  );
  process.exit(1);
}

const [sheets, fontCss] = await Promise.all([loadSheets(), loadFontCss()]);

const browser = await chromium.launch({ executablePath });
const page = await browser.newPage();

let written = 0;

try {
  for (const sheet of sheets) {
    const html = renderCheatSheet(sheet, fontCss);
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);

    /**
     * A sheet is a fixed A4 box with `overflow: hidden`, so content that no
     * longer fits is silently cut off — and a PDF missing its last section
     * looks perfectly fine until someone reads it. Fail instead.
     */
    const overflowing = await page.evaluate(() =>
      [...document.querySelectorAll(".sheet main")]
        .map((main, index) => ({
          page: index + 1,
          overflowBy: main.scrollHeight - main.clientHeight,
        }))
        .filter(entry => entry.overflowBy > 1)
    );

    if (overflowing.length > 0) {
      const detail = overflowing
        .map(entry => `page ${entry.page} by ${entry.overflowBy}px`)
        .join(", ");
      throw new Error(
        `${sheet.fileName}: content does not fit the page (${detail}). ` +
          `Shorten the content or split it across another page.`
      );
    }

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    /**
     * A sheet box that ends up a hair taller than the paper spills onto a second
     * page, which takes the footer with it. The overflow check above cannot see
     * that — it measures the layout, not the pagination — so verify the PDF.
     */
    const renderedPages = countPdfPages(pdf);
    if (renderedPages !== sheet.pages.length) {
      throw new Error(
        `${sheet.fileName}: rendered ${renderedPages} PDF page(s) for ` +
          `${sheet.pages.length} sheet page(s). The page box does not match the paper.`
      );
    }

    const outputDir = join(root, "public", "downloads", sheet.slug);
    const outputPath = join(outputDir, sheet.fileName);

    if (
      existsSync(outputPath) &&
      withoutTimestamps(readFileSync(outputPath)) === withoutTimestamps(pdf)
    ) {
      console.log(`unchanged  ${sheet.fileName}`);
      continue;
    }

    mkdirSync(outputDir, { recursive: true });
    writeFileSync(outputPath, pdf);
    written += 1;
    console.log(
      `wrote      ${sheet.fileName} (${Math.round(pdf.length / 1000)} kB)`
    );
  }
} finally {
  await browser.close();
}

console.log(
  `\n${sheets.length} sheet(s) rendered, ${written} file(s) written.`
);
