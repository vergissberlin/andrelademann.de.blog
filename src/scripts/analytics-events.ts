import { track } from "swetrix";

const POSTS_INDEX = "/posts/";

function isPostPage(pathname: string): boolean {
  return (
    pathname.startsWith(POSTS_INDEX) && pathname.length > POSTS_INDEX.length
  );
}

function trackPostRead(): void {
  const { pathname } = location;
  if (!isPostPage(pathname)) return;

  void track({
    ev: "POST_READ",
    meta: { slug: pathname },
  });
}

function handleAnalyticsClick(event: MouseEvent): void {
  const target = (event.target as Element | null)?.closest(
    "[data-swetrix-event]"
  );
  if (!(target instanceof HTMLElement)) return;

  const eventName = target.dataset.swetrixEvent;
  if (!eventName) return;

  const meta: Record<string, string> = {};
  const platform = target.dataset.swetrixPlatform;
  if (platform) meta.platform = platform;

  void track({
    ev: eventName,
    meta: Object.keys(meta).length ? meta : undefined,
  });
}

let clickListenerBound = false;

function bindClickTracking(): void {
  if (clickListenerBound) return;
  clickListenerBound = true;
  document.addEventListener("click", handleAnalyticsClick);
}

document.addEventListener("astro:page-load", () => {
  bindClickTracking();
  trackPostRead();
});
