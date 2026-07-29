import { track } from "swetrix";
import { readSwetrixMeta } from "@/utils/swetrixMeta";

const POSTS_INDEX = "/posts/";

function isPostPage(pathname: string): boolean {
  return (
    pathname.startsWith(POSTS_INDEX) && pathname.length > POSTS_INDEX.length
  );
}

/** Guards against reporting the same page view twice; reset on navigation. */
let postReadTracked = false;

function trackPostRead(): void {
  if (postReadTracked) return;

  const { pathname } = location;
  if (!isPostPage(pathname)) return;

  postReadTracked = true;
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

  void track({
    ev: eventName,
    meta: readSwetrixMeta(target.dataset),
  });
}

let clickListenerBound = false;

function bindClickTracking(): void {
  if (clickListenerBound) return;
  clickListenerBound = true;
  document.addEventListener("click", handleAnalyticsClick);
}

function handlePageLoad(): void {
  bindClickTracking();
  trackPostRead();
}

document.addEventListener("astro:page-load", handlePageLoad);

// A client-side navigation is a new page view, so allow POST_READ again.
document.addEventListener("astro:before-swap", () => {
  postReadTracked = false;
});

// This module is imported dynamically, so `astro:page-load` has usually already
// fired by the time it evaluates — leaving the very first page view untracked
// and every delegated click on it unbound. Catch up immediately; the guards
// above keep the subsequent event from double-reporting.
handlePageLoad();
