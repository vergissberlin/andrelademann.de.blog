/**
 * Generates public/default-og.jpg from the shared default OG image template.
 * Run: node scripts/generate-default-og.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import sharp from "sharp";

const site = {
  title: "André Lademann",
  description:
    "Engineering blog about cloud architecture, software development, and modern tooling.",
  url: "https://blog.andrelademann.de",
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

const OG_THEME = {
  background: "#212737",
  foreground: "#eaedf3",
  accent: "#ff6b01",
  muted: "#343f60",
  mutedForeground: "#afb9ca",
  border: "#ab4b08",
};

function createDefaultOgImageElement({ title, description, hostname }) {
  return {
    type: "div",
    props: {
      style: {
        background: OG_THEME.background,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Google Sans Code",
        color: OG_THEME.foreground,
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "-1px",
              right: "-1px",
              border: `4px solid ${OG_THEME.border}`,
              background: OG_THEME.muted,
              opacity: "0.9",
              borderRadius: "4px",
              margin: "2.5rem",
              width: "88%",
              height: "80%",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              border: `4px solid ${OG_THEME.accent}`,
              background: OG_THEME.background,
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              margin: "2rem",
              width: "88%",
              height: "80%",
            },
            children: {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  margin: "20px",
                  width: "90%",
                  height: "90%",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "90%",
                        maxHeight: "90%",
                        overflow: "hidden",
                        textAlign: "center",
                        gap: "24px",
                      },
                      children: [
                        {
                          type: "p",
                          props: {
                            style: {
                              fontSize: 72,
                              fontWeight: "bold",
                              color: OG_THEME.foreground,
                              margin: 0,
                              lineHeight: 1.1,
                            },
                            children: title,
                          },
                        },
                        {
                          type: "p",
                          props: {
                            style: {
                              fontSize: 28,
                              color: OG_THEME.mutedForeground,
                              margin: 0,
                              lineHeight: 1.4,
                              maxWidth: "90%",
                            },
                            children: description,
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        marginBottom: "8px",
                        fontSize: 28,
                      },
                      children: {
                        type: "span",
                        props: {
                          style: {
                            overflow: "hidden",
                            fontWeight: "bold",
                            color: OG_THEME.accent,
                          },
                          children: hostname,
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  };
}

async function loadGoogleSansCodeFonts() {
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Google+Sans+Code:wght@400;700&display=swap",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)",
      },
    }
  ).then(res => res.text());

  const urls = [...css.matchAll(/src:\s*url\(([^)]+)\)\s*format\('([^']+)'\)/g)];

  const regularUrl = urls.find(([, , format]) => format === "woff")?.[1];
  const boldUrl = urls.filter(([, , format]) => format === "woff").at(-1)?.[1];

  if (!regularUrl || !boldUrl) {
    throw new Error("Could not resolve Google Sans Code font URLs.");
  }

  const [regularData, boldData] = await Promise.all([
    fetch(regularUrl).then(res => res.arrayBuffer()),
    fetch(boldUrl).then(res => res.arrayBuffer()),
  ]);

  return [
    {
      name: "Google Sans Code",
      data: regularData,
      weight: 400,
      style: "normal",
    },
    {
      name: "Google Sans Code",
      data: boldData,
      weight: 700,
      style: "normal",
    },
  ];
}

const fonts = await loadGoogleSansCodeFonts();

const svg = await satori(
  createDefaultOgImageElement({
    title: site.title,
    description: site.description,
    hostname: new URL(site.url).hostname,
  }),
  {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    embedFont: true,
    fonts,
  }
);

const jpgBuffer = await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();

const outputPath = join(root, "public", "default-og.jpg");
writeFileSync(outputPath, jpgBuffer);

console.log(`Wrote ${outputPath} (${jpgBuffer.length} bytes)`);
