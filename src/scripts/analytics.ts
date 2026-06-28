import {
  init,
  trackError,
  trackErrors,
  trackViews,
} from "swetrix";
import { PUBLIC_SWETRIX_PID } from "astro:env/client";
import { getSwetrixApiUrl } from "@/utils/swetrix";

if (PUBLIC_SWETRIX_PID) {
  init(PUBLIC_SWETRIX_PID, {
    apiURL: getSwetrixApiUrl(),
    disabled: import.meta.env.DEV,
    respectDNT: true,
  });
  trackViews();
  trackErrors({
    sampleRate: 1,
    callback: payload => {
      if (
        payload.filename?.includes("chrome-extension://") ||
        payload.filename?.includes("moz-extension://")
      ) {
        return false;
      }
      return payload;
    },
  });

  window.addEventListener("unhandledrejection", event => {
    const reason = event.reason;
    const message =
      reason instanceof Error ? reason.message : String(reason ?? "Unknown");
    const stackTrace =
      reason instanceof Error ? (reason.stack ?? null) : null;

    trackError({
      name: reason instanceof Error ? reason.name : "UnhandledRejection",
      message,
      stackTrace,
    });
  });

  void import("./analytics-events");
}
