export function nextImageIndex(currentIndex: number, imageCount: number) {
  if (imageCount <= 0) return 0;
  return (currentIndex + 1) % imageCount;
}

export function previousImageIndex(currentIndex: number, imageCount: number) {
  if (imageCount <= 0) return 0;
  return (currentIndex - 1 + imageCount) % imageCount;
}

export function formatImageCounter(
  template: string,
  currentIndex: number,
  imageCount: number
) {
  return template
    .replace("{{current}}", String(currentIndex + 1))
    .replace("{{total}}", String(imageCount));
}

export function getImageSource(
  image: Pick<HTMLImageElement, "currentSrc" | "src">
) {
  return image.currentSrc || image.src;
}

export function initialiseImageLightboxes(root: ParentNode = document) {
  const dialogs = Array.from(
    root.querySelectorAll<HTMLDialogElement>(
      "dialog[data-image-lightbox-modal]"
    )
  );

  for (const dialog of dialogs) initialiseImageLightbox(dialog);
}

function initialiseImageLightbox(dialog: HTMLDialogElement) {
  if (dialog.dataset.initialised === "true") return;

  const scopeSelector = dialog.dataset.imageLightboxScope;
  const scope = scopeSelector ? document.querySelector(scopeSelector) : null;
  if (!scope) return;

  const images = Array.from(scope.querySelectorAll<HTMLImageElement>("img"));
  if (images.length === 0) return;

  const dialogImage = dialog.querySelector<HTMLImageElement>(
    "[data-image-lightbox-image]"
  );
  const caption = dialog.querySelector<HTMLElement>(
    "[data-image-lightbox-caption]"
  );
  const counter = dialog.querySelector<HTMLElement>(".image-lightbox__counter");
  const closeButton = dialog.querySelector<HTMLButtonElement>(
    "[data-image-lightbox-close]"
  );
  const previousButton = dialog.querySelector<HTMLButtonElement>(
    "[data-image-lightbox-previous]"
  );
  const nextButton = dialog.querySelector<HTMLButtonElement>(
    "[data-image-lightbox-next]"
  );

  if (
    !dialogImage ||
    !caption ||
    !counter ||
    !closeButton ||
    !previousButton ||
    !nextButton
  ) {
    return;
  }

  dialog.dataset.initialised = "true";

  const counterTemplate =
    dialog.dataset.imageLightboxCounter ?? "{{current}} / {{total}}";
  const openImageLabel =
    dialog.dataset.imageLightboxOpenLabel ?? "Open image in gallery";
  let currentIndex = 0;
  let lastFocused: HTMLImageElement | null = null;
  let previousOverflow = "";

  const update = () => {
    const source = images[currentIndex];
    if (!source) return;

    dialogImage.src = getImageSource(source);
    dialogImage.alt = source.alt;
    caption.textContent = source.alt;
    caption.hidden = !source.alt;
    counter.textContent = formatImageCounter(
      counterTemplate,
      currentIndex,
      images.length
    );

    const hasMultipleImages = images.length > 1;
    previousButton.hidden = !hasMultipleImages;
    nextButton.hidden = !hasMultipleImages;
  };

  const move = (direction: 1 | -1) => {
    currentIndex =
      direction === 1
        ? nextImageIndex(currentIndex, images.length)
        : previousImageIndex(currentIndex, images.length);
    update();
  };

  const open = (index: number, trigger: HTMLImageElement) => {
    currentIndex = index;
    lastFocused = trigger;
    update();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeButton.focus();
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!dialog.open) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "Tab") {
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([hidden]):not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const cleanup = () => {
    document.body.style.overflow = previousOverflow;
    document.removeEventListener("keydown", onKeyDown);
    lastFocused?.focus();
    lastFocused = null;
  };

  for (const [index, image] of images.entries()) {
    image.classList.add("cursor-zoom-in");
    image.setAttribute("role", "button");
    image.setAttribute("tabindex", "0");
    image.setAttribute("aria-haspopup", "dialog");
    image.setAttribute(
      "aria-label",
      image.alt ? `${openImageLabel}: ${image.alt}` : openImageLabel
    );

    image.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      open(index, image);
    });
    image.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      open(index, image);
    });
  }

  closeButton.addEventListener("click", close);
  previousButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  dialog.addEventListener("click", event => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener("close", cleanup);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("astro:before-swap", close, { once: true });
}
