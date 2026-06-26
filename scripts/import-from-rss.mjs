/**
 * One-time migration: Hashnode RSS → Astro Markdown posts
 * Run: node scripts/import-from-rss.mjs
 *
 * Creates:
 *   src/content/posts/<slug>.md   — post with frontmatter
 *   public/images/posts/<slug>/   — hero + inline images
 */

import { mkdir, writeFile } from "fs/promises";
import { join, dirname, extname, basename } from "path";
import { fileURLToPath } from "url";
import Parser from "rss-parser";
import TurndownService from "turndown";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const POSTS_DIR = join(ROOT, "src/content/posts");
const IMAGES_DIR = join(ROOT, "public/images/posts");
const RSS_URL = "https://blog.andrelademann.de/rss.xml";

const rssParser = new Parser({
  customFields: {
    item: [
      ["content:encoded", "contentEncoded"],
      ["dc:creator", "creator"],
    ],
  },
});

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  hr: "---",
});

// Preserve language hints from <pre><code class="language-xyz">
turndown.addRule("fencedCodeBlock", {
  filter: (node) =>
    node.nodeName === "PRE" &&
    node.firstChild?.nodeName === "CODE",
  replacement: (_content, node) => {
    const cls = node.firstChild?.getAttribute?.("class") ?? "";
    const lang = (cls.match(/language-(\S+)/) ?? [null, ""])[1];
    const code = node.firstChild?.textContent ?? "";
    return `\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
  },
});

function cleanTag(raw) {
  return raw
    .replace(/^#+/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slugFromUrl(url) {
  return url.split("/").filter(Boolean).pop();
}

function yamlStr(value) {
  const escaped = String(value).replace(/"/g, '\\"');
  return `"${escaped}"`;
}

async function downloadImage(url, destPath) {
  await mkdir(dirname(destPath), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  await writeFile(destPath, Buffer.from(buf));
}

async function localiseImages(html, slug) {
  const imgRegex = /<img[^>]+src="(https?:\/\/[^"]+)"[^>]*>/gi;
  const matches = [...html.matchAll(imgRegex)];
  let result = html;
  let idx = 0;

  for (const match of matches) {
    const remoteUrl = match[1];
    idx++;
    const ext = extname(remoteUrl.split("?")[0]) || ".jpg";
    const filename = `img-${idx}${ext}`;
    const localPath = `/images/posts/${slug}/${filename}`;
    const destPath = join(IMAGES_DIR, slug, filename);

    try {
      await downloadImage(remoteUrl, destPath);
      result = result.replace(remoteUrl, localPath);
      console.log(`    ↳ img ${idx}: ${basename(destPath)}`);
    } catch (err) {
      console.warn(`    ⚠  img ${idx} failed (${remoteUrl.slice(0, 60)}…): ${err.message}`);
    }
  }
  return result;
}

async function processPost(item) {
  const slug = slugFromUrl(item.link);
  console.log(`\n→ ${item.title}`);

  // Hero image
  let heroPath;
  if (item.enclosure?.url) {
    const ext = extname(item.enclosure.url.split("?")[0]) || ".jpg";
    const heroFilename = `hero${ext}`;
    const heroDest = join(IMAGES_DIR, slug, heroFilename);
    try {
      await downloadImage(item.enclosure.url, heroDest);
      heroPath = `/images/posts/${slug}/${heroFilename}`;
      console.log(`  ✓ hero image`);
    } catch (err) {
      console.warn(`  ⚠ hero image failed: ${err.message}`);
    }
  }

  // Inline images in content
  let html = item.contentEncoded ?? item.content ?? "";
  html = await localiseImages(html, slug);

  // HTML → Markdown
  const body = turndown.turndown(html);

  // Tags: clean and deduplicate
  const tags = [...new Set(
    (item.categories ?? []).map(cleanTag).filter(Boolean)
  )];

  // Frontmatter
  const pubDate = new Date(item.pubDate);
  const lines = [
    "---",
    `author: André Lademann`,
    `pubDatetime: ${pubDate.toISOString()}`,
    `title: ${yamlStr(item.title)}`,
    `slug: ${slug}`,
    `featured: false`,
    `draft: false`,
    `tags:`,
    ...tags.map((t) => `  - ${t}`),
    heroPath ? `ogImage: ${heroPath}` : null,
    `description: ${yamlStr(
      (item.contentSnippet ?? item.description ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 300)
    )}`,
    `canonicalURL: ${item.link}`,
    "---",
  ]
    .filter((l) => l !== null)
    .join("\n");

  const content = `${lines}\n\n${body}\n`;
  const filePath = join(POSTS_DIR, `${slug}.md`);
  await writeFile(filePath, content, "utf-8");
  console.log(`  ✓ src/content/posts/${slug}.md`);
}

async function main() {
  console.log("📥 Fetching RSS feed …");
  const feed = await rssParser.parseURL(RSS_URL);
  console.log(`   Found ${feed.items.length} posts`);

  await mkdir(POSTS_DIR, { recursive: true });
  await mkdir(IMAGES_DIR, { recursive: true });

  for (const item of feed.items) {
    await processPost(item);
  }

  console.log("\n✅  Migration complete!");
  console.log(`   Posts → src/content/posts/`);
  console.log(`   Images → public/images/posts/`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
