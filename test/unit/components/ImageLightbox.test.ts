import { describe, expect, it } from "vitest";
import {
  formatImageCounter,
  getImageSource,
  nextImageIndex,
  previousImageIndex,
} from "../../../src/scripts/imageLightbox";

describe("ImageLightbox navigation", () => {
  it("moves forward and wraps to the first image", () => {
    expect(nextImageIndex(0, 3)).toBe(1);
    expect(nextImageIndex(2, 3)).toBe(0);
  });

  it("moves backwards and wraps to the last image", () => {
    expect(previousImageIndex(2, 3)).toBe(1);
    expect(previousImageIndex(0, 3)).toBe(2);
  });

  it("keeps an empty gallery at index zero", () => {
    expect(nextImageIndex(0, 0)).toBe(0);
    expect(previousImageIndex(0, 0)).toBe(0);
  });

  it("formats the localised counter and prefers currentSrc", () => {
    expect(formatImageCounter("Bild {{current}} von {{total}}", 1, 3)).toBe(
      "Bild 2 von 3"
    );
    expect(
      getImageSource({ currentSrc: "/large-image.jpg", src: "/image.jpg" })
    ).toBe("/large-image.jpg");
  });
});
