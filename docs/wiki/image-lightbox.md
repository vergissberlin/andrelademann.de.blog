# Image Lightbox

`ImageLightbox.astro` turns all images inside a selected scope into an accessible full-size gallery.

## Usage

Render the component after the image collection and point it at the collection with `scopeSelector`:

```astro
<div id="gallery">
  <img src="/images/first.jpg" alt="First image" />
  <img src="/images/second.jpg" alt="Second image" />
</div>

<ImageLightbox scopeSelector="#gallery" />
```

The component adds keyboard-focusable triggers to every image, including images wrapped in links. The modal supports:

- previous and next buttons with wraparound navigation;
- Left and Right Arrow key navigation;
- Escape to close and Tab focus trapping;
- click-outside-to-close behaviour;
- focus restoration to the image that opened the gallery;
- localised labels for English and German pages.

The post page mounts one instance against `#article`, so all images in a post share one gallery. Original image links remain usable through the modal’s full-size image source.
