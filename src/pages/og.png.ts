import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { fontData, experimental_getFontFileURL } from "astro:assets";
import { getFontPathByWeight } from "@/utils/getFontPathByWeight";
import {
  createDefaultOgImageElement,
  createDefaultOgSatoriOptions,
} from "@/utils/defaultOgImage";
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

  const svg = await satori(
    createDefaultOgImageElement({
      title: config.site.title,
      description: config.site.description,
      hostname: new URL(config.site.url).hostname,
    }),
    createDefaultOgSatoriOptions([
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
    ])
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};
