import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { fontData, experimental_getFontFileURL } from "astro:assets";
import { getFontPathByWeight } from "@/utils/getFontPathByWeight";
import config from "@/config";

export const GET: APIRoute = async context => {
  const fonts = fontData["--font-google-sans-code"];
  const regularFontPath = getFontPathByWeight(fonts, 400);
  const boldFontPath = getFontPathByWeight(fonts, 700);

  if (regularFontPath === undefined || boldFontPath === undefined) {
    throw new Error("Cannot find the font path.");
  }

  const [regularData, boldData] = await Promise.all([
    fetch(experimental_getFontFileURL(regularFontPath, context.url)).then(res =>
      res.arrayBuffer()
    ),
    fetch(experimental_getFontFileURL(boldFontPath, context.url)).then(res =>
      res.arrayBuffer()
    ),
  ]);

  const hostname = new URL(config.site.url).hostname;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Google Sans Code",
        },
        children: [
          // Accent gradient bar (top)
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "6px",
                background:
                  "linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
              },
            },
          },
          // Main card
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "60px 72px",
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
              },
              children: [
                // Top: avatar initials + name
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "28px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 32,
                            fontWeight: "bold",
                            color: "#fff",
                            flexShrink: "0",
                          },
                          children: "AL",
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: 32,
                            fontWeight: "bold",
                            color: "#94a3b8",
                            letterSpacing: "0.05em",
                          },
                          children: hostname,
                        },
                      },
                    ],
                  },
                },
                // Middle: title + description
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    },
                    children: [
                      {
                        type: "h1",
                        props: {
                          style: {
                            fontSize: 80,
                            fontWeight: "bold",
                            color: "#f8fafc",
                            margin: "0",
                            lineHeight: "1.1",
                          },
                          children: config.site.title,
                        },
                      },
                      {
                        type: "p",
                        props: {
                          style: {
                            fontSize: 30,
                            color: "#94a3b8",
                            margin: "0",
                            lineHeight: "1.5",
                            maxWidth: "800px",
                          },
                          children: config.site.description,
                        },
                      },
                    ],
                  },
                },
                // Bottom: tag pills
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      gap: "16px",
                    },
                    children: [
                      ...[
                        "Cloud Architecture",
                        "Software Engineering",
                        "DevOps",
                      ].map(tag => ({
                        type: "div",
                        props: {
                          style: {
                            padding: "8px 20px",
                            borderRadius: "999px",
                            border: "2px solid #334155",
                            color: "#94a3b8",
                            fontSize: 22,
                          },
                          children: tag,
                        },
                      })),
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: [
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
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};
