import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://blog.andrelademann.de",
    title: "André Lademann",
    description:
      "Engineering blog about cloud architecture, software development, and modern tooling.",
    author: "André Lademann",
    profile: "https://andrelademann.de",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Europe/Berlin",
    dir: "ltr",
  },
  posts: {
    perPage: 6,
    perIndex: 6,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/vergissberlin" },
    { name: "linkedin", url: "https://www.linkedin.com/in/andre-lademann/" },
    { name: "mail", url: "info@andrelademann.de" },
  ],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "linkedin", url: "https://www.linkedin.com/shareArticle?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
    { name: "xing", url: "https://xing.com/share/url/" },
  ],
});