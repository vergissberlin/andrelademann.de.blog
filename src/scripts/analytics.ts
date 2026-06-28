import { init, trackErrors, trackViews } from "swetrix";
import { PUBLIC_SWETRIX_PID } from "astro:env/client";

if (PUBLIC_SWETRIX_PID) {
  init(PUBLIC_SWETRIX_PID, {
    disabled: import.meta.env.DEV,
    respectDNT: true,
  });
  trackViews();
  trackErrors();
}
