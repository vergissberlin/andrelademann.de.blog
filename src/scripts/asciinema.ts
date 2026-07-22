/**
 * Global asciinema-player bootstrap.
 *
 * Posts embed casts declaratively via a container element, e.g.
 *
 *   <div
 *     data-asciinema-cast="/casts/my-post/demo.cast"
 *     data-asciinema-theme="monokai"
 *   ></div>
 *
 * The self-hosted player library and stylesheet live under
 * `public/vendor/asciinema-player/`.
 *
 * Initialisation is bound to `astro:page-load` (not a one-off inline script)
 * so it runs on the initial load *and* after every ClientRouter view
 * transition — otherwise casts stay blank when navigating between pages in
 * the SPA. Players are disposed on `astro:before-swap` to stop their timers
 * and avoid leaking across navigations.
 */

const PLAYER_CSS = "/vendor/asciinema-player/asciinema-player.css";
const PLAYER_JS = "/vendor/asciinema-player/asciinema-player.min.js";

interface AsciinemaPlayer {
  dispose: () => void;
}

interface AsciinemaPlayerApi {
  create: (
    src: string,
    element: HTMLElement,
    options?: Record<string, unknown>
  ) => AsciinemaPlayer;
}

declare global {
  interface Window {
    AsciinemaPlayer?: AsciinemaPlayerApi;
  }
}

// Cached across navigations so the ~180 KB library is fetched at most once.
let libraryPromise: Promise<AsciinemaPlayerApi> | undefined;

// Tracks mounted players by their container so we can dispose them before a
// view-transition swap and skip already-initialised containers.
const players = new WeakMap<HTMLElement, AsciinemaPlayer>();
let mounted = new Set<HTMLElement>();

function ensureStylesheet(): void {
  if (document.querySelector(`link[href="${PLAYER_CSS}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = PLAYER_CSS;
  document.head.appendChild(link);
}

function loadLibrary(): Promise<AsciinemaPlayerApi> {
  if (window.AsciinemaPlayer) return Promise.resolve(window.AsciinemaPlayer);
  if (libraryPromise) return libraryPromise;

  libraryPromise = new Promise<AsciinemaPlayerApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PLAYER_JS;
    script.addEventListener("load", () => {
      if (window.AsciinemaPlayer) resolve(window.AsciinemaPlayer);
      else
        reject(
          new Error(
            "asciinema-player loaded but window.AsciinemaPlayer is missing"
          )
        );
    });
    script.addEventListener("error", () =>
      reject(new Error(`Failed to load ${PLAYER_JS}`))
    );
    document.head.appendChild(script);
  });

  // Allow a later retry if this load fails.
  libraryPromise.catch(() => {
    libraryPromise = undefined;
  });

  return libraryPromise;
}

function parseOptions(el: HTMLElement): Record<string, unknown> {
  const options: Record<string, unknown> = {};

  if (el.dataset.asciinemaTheme) options.theme = el.dataset.asciinemaTheme;

  // Optional escape hatch: a JSON blob for any other player option.
  if (el.dataset.asciinemaOptions) {
    try {
      Object.assign(options, JSON.parse(el.dataset.asciinemaOptions));
    } catch (error) {
      // eslint-disable-next-line no-console -- surface authoring mistakes in the browser console
      console.error("Invalid data-asciinema-options JSON", el, error);
    }
  }

  return options;
}

async function mountCasts(): Promise<void> {
  const targets = document.querySelectorAll<HTMLElement>(
    "[data-asciinema-cast]"
  );
  if (targets.length === 0) return;

  ensureStylesheet();

  let api: AsciinemaPlayerApi;
  try {
    api = await loadLibrary();
  } catch (error) {
    // eslint-disable-next-line no-console -- surface player load failures in the browser console
    console.error(error);
    return;
  }

  targets.forEach(el => {
    const src = el.dataset.asciinemaCast;
    if (!src || players.has(el)) return;

    const player = api.create(src, el, parseOptions(el));
    players.set(el, player);
    mounted.add(el);
  });
}

function disposeAll(): void {
  mounted.forEach(el => {
    const player = players.get(el);
    if (!player) return;
    try {
      player.dispose();
    } catch {
      // Player may already be gone; disposal is best-effort.
    }
    players.delete(el);
  });
  mounted = new Set<HTMLElement>();
}

document.addEventListener("astro:page-load", mountCasts);
document.addEventListener("astro:before-swap", disposeAll);

// Make this file a module so the `declare global` Window augmentation above is valid.
export {};
