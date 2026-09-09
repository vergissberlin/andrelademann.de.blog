import type { CollectionEntry } from "astro:content";

export type BlogLocale = "en" | "de";

export function getPostLocale(post: CollectionEntry<"posts">): BlogLocale {
  return post.data.locale ?? "en";
}

export function filterPostsByLocale(
  posts: CollectionEntry<"posts">[],
  locale: string
) {
  return posts.filter(post => getPostLocale(post) === locale);
}
