import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import { filterPostsByLocale } from "@/utils/postLocale";
import config from "@/config";

export async function GET() {
  const posts = filterPostsByLocale(await getCollection("posts"), "de");
  const sortedPosts = getSortedPosts(posts);

  return rss({
    title: `${config.site.title} – Deutsch`,
    description: "Deutsche Beiträge von André Lademann.",
    site: config.site.url,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getPostUrl(id, filePath, "de"),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
