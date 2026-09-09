import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: z.object({
    author: z.string().default(config.site.author),
    locale: z.enum(["en", "de"]).default("en"),
    translationKey: z.string().optional(),
    pubDatetime: z.date(),
    modDatetime: z.date().optional().nullable(),
    title: z.string(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    ogImage: z.string().optional(),
    heroImage: z.string().optional(),
    description: z.string(),
    canonicalURL: z.string().optional(),
    hideEditPost: z.boolean().optional(),
    timezone: z.string().optional(),
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string(),
          note: z.string().optional(),
        })
      )
      .optional(),
    // Field names mirror `DownloadInput` in src/utils/download.ts so the object
    // can be spread straight into <DownloadCard> without a mapping layer.
    // `fileSize` is deliberately absent: the size is read from disk at build
    // time, so it cannot drift from the file the reader actually gets.
    download: z
      .object({
        /** Root-relative path inside `public/`, e.g. "/downloads/<slug>/file.pdf". */
        file: z.string(),
        title: z.string(),
        description: z.string().optional(),
        fileType: z.string().optional(),
        fileName: z.string().optional(),
      })
      .optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    locale: z.enum(["en", "de"]).default("en"),
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

export const collections = { posts, pages };
