// Screenshot viewer. Each thumbnail is a plain link to the full image, so the
// gallery works without scripts; here the link opens a <dialog> instead.
//
// Motion: once GSAP has loaded (only while motion is on, and not on data
// saver unless the visitor chose motion), the screenshot travels from its
// thumbnail to the viewer and back, and the dialog gets data-flip so the CSS
// fade steps aside. Until then, or without it, the CSS fade and scale in
// global.css run instead. The setting is read on every use, so a switch in
// the footer applies to the next opening.

import { motionAllowed, onMotionChange, storedChoice } from "./motion-preference";

type Gsap = typeof import("gsap").gsap;

const FADE_MS = 200;
// GSAP's expo.out is cubic-bezier(0.16, 1, 0.3, 1), the --ease-out token.
const EASE = "expo.out";
const GROUND = "rgba(8, 10, 11, 1)";
const CLEAR = "rgba(8, 10, 11, 0)";

export function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>("dialog.lightbox");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const img = dialog.querySelector<HTMLImageElement>("[data-lightbox-img]")!;
  const title = dialog.querySelector<HTMLElement>("[data-lightbox-title]")!;
  const caption = dialog.querySelector<HTMLElement>("[data-lightbox-caption]")!;
  const counter = dialog.querySelector<HTMLElement>("[data-lightbox-counter]")!;
  const prev = dialog.querySelector<HTMLButtonElement>("[data-lightbox-prev]")!;
  const next = dialog.querySelector<HTMLButtonElement>("[data-lightbox-next]")!;
  const close = dialog.querySelector<HTMLButtonElement>("[data-lightbox-close]")!;
  const chrome = [dialog.querySelector<HTMLElement>(".lightbox-bar")!, dialog.querySelector<HTMLElement>(".lightbox-info")!];
  const template = dialog.dataset.counter ?? "{i} / {n}";
  const saveData = !storedChoice() && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

  let items: HTMLAnchorElement[] = [];
  let index = 0;
  let opener: HTMLAnchorElement | null = null;
  let closing = 0;
  let shown = 0;
  let gsap: Gsap | null = null;
  // Every tween of one viewing lives in one GSAP context. Closing kills it
  // (not revert: reverting would put finished tweens back at their start
  // values) and then removes the inline styles they left.
  let session: ReturnType<Gsap["context"]> | null = null;
  const animate = (fn: () => void) => {
    session ??= gsap!.context(() => {});
    session.add(fn);
  };

  // GSAP is fetched once, either at idle time or when motion is switched on.
  let loading = false;
  const loadGsap = () => {
    if (loading || gsap) return;
    loading = true;
    import("gsap")
      .then((m) => {
        gsap = m.gsap;
        dialog.dataset.flip = "";
      })
      .catch(() => {
        loading = false;
      });
  };
  if (motionAllowed() && !saveData) {
    if ("requestIdleCallback" in window) window.requestIdleCallback(loadGsap, { timeout: 3000 });
    else setTimeout(loadGsap, 1000);
  }
  onMotionChange((motion) => motion === "on" && loadGsap());
  const flipping = () => !!gsap && motionAllowed();

  // Transform that places the full image over its thumbnail. Thumbnails crop
  // the screenshot (cover, from the top left), so the image is scaled to
  // cover the thumbnail and clipped to it.
  function overThumbnail(thumb: DOMRect, full: DOMRect) {
    const scale = Math.max(thumb.width / full.width, thumb.height / full.height);
    // Rounded and never negative: a float such as 1e-13 would print in
    // exponent form and break the interpolation of the inset() string.
    const crop = (shown: number, total: number) => Math.max(0, (1 - shown / total) * 100).toFixed(3);
    const right = crop(thumb.width, full.width * scale);
    const bottom = crop(thumb.height, full.height * scale);
    return {
      transformOrigin: "0 0",
      x: thumb.left - full.left,
      y: thumb.top - full.top,
      scale,
      clipPath: `inset(0% ${right}% ${bottom}% 0%)`,
    };
  }

  const decoded = (ms: number) =>
    Promise.race([img.decode().then(() => true, () => false), new Promise<boolean>((ok) => setTimeout(() => ok(false), ms))]);

  function show(i: number, direction = 0) {
    index = (i + items.length) % items.length;
    const link = items[index]!;
    img.src = link.href;
    img.alt = link.dataset.alt ?? "";
    title.textContent = link.dataset.title ?? "";
    caption.textContent = link.dataset.caption ?? "";
    counter.textContent = template.replace("{i}", String(index + 1)).replace("{n}", String(items.length));
    const single = items.length < 2;
    prev.hidden = single;
    next.hidden = single;

    // Next and previous: the new screenshot slides in from the side it came from.
    if (direction && flipping() && dialog!.open) {
      const g = gsap!;
      const token = ++shown;
      animate(() => {
        g.killTweensOf(img);
        g.set(img, { autoAlpha: 0, clearProps: "transform,clipPath" });
      });
      decoded(1500).then(() => {
        if (token !== shown || !dialog!.open) return;
        animate(() => g.fromTo(img, { autoAlpha: 0, x: 24 * direction }, { autoAlpha: 1, x: 0, duration: 0.28, ease: EASE, clearProps: "transform" }));
      });
    }
  }

  // Without GSAP, each new screenshot fades in once it has loaded.
  img.addEventListener("load", () => {
    if (motionAllowed() && !flipping()) img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_MS, easing: "ease-out" });
  });

  async function flipIn(thumb: DOMRect) {
    const g = gsap!;
    const token = ++shown;
    animate(() => {
      g.fromTo(dialog, { backgroundColor: CLEAR }, { backgroundColor: GROUND, duration: 0.25, ease: "power1.out" });
      // opacity, not autoAlpha: hiding the bar with visibility would take the
      // focus off its Close button.
      g.fromTo(chrome, { opacity: 0 }, { opacity: 1, duration: 0.25, delay: 0.12, ease: "power1.out" });
      g.set(img, { autoAlpha: 0 });
    });
    // A slow image does not hold the viewer back: it fades in when it arrives.
    const ready = await decoded(250);
    if (token !== shown || !dialog!.open) return;
    if (!ready) {
      await decoded(10000);
      if (token === shown && dialog!.open) animate(() => g.to(img, { autoAlpha: 1, duration: FADE_MS / 1000 }));
      return;
    }
    const full = img.getBoundingClientRect();
    animate(() =>
      g.fromTo(
        img,
        { ...overThumbnail(thumb, full), autoAlpha: 1 },
        { x: 0, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.4, ease: EASE, clearProps: "transform,clipPath,transformOrigin" },
      ),
    );
  }

  function flipOut() {
    const g = gsap!;
    const link = items[index]!;
    const thumb = link.getBoundingClientRect();
    const full = img.getBoundingClientRect();
    const back = thumb.width > 0 && thumb.bottom > 0 && thumb.top < window.innerHeight && full.width > 0;
    ++shown;
    animate(() => {
      // Whatever is still opening stops where it is and turns around.
      g.killTweensOf([dialog, img, ...chrome]);
      const timeline = g.timeline({ onComplete: () => dialog!.close() });
      timeline
        .to(chrome, { opacity: 0, duration: 0.15, ease: "power1.out" }, 0)
        .to(dialog, { backgroundColor: CLEAR, duration: 0.28, ease: "power1.out" }, 0);
      if (back) timeline.to(img, { ...overThumbnail(thumb, full), duration: 0.3, ease: EASE }, 0);
      else timeline.to(img, { autoAlpha: 0, scale: 0.97, duration: 0.2, ease: EASE }, 0);
    });
    // Focus returns to the thumbnail the screenshot flew back to.
    opener = link;
    closing = window.setTimeout(() => dialog!.close(), 600);
  }

  function open(link: HTMLAnchorElement) {
    opener = link;
    items = Array.from(document.querySelectorAll<HTMLAnchorElement>(`a[data-gallery="${link.dataset.gallery}"]`));
    const thumb = link.getBoundingClientRect();
    show(items.indexOf(link));
    dialog!.dataset.state = "opening";
    dialog!.showModal();
    close.focus();
    if (flipping()) {
      dialog!.dataset.state = "open";
      flipIn(thumb);
      return;
    }
    // One frame later the open state starts the fade and scale in CSS.
    requestAnimationFrame(() => requestAnimationFrame(() => (dialog!.dataset.state = "open")));
  }

  // Fade out first, then close; without motion, close at once.
  function shut() {
    if (!dialog!.open || closing) return;
    if (!motionAllowed()) return dialog!.close();
    if (flipping()) return flipOut();
    dialog!.dataset.state = "closing";
    closing = window.setTimeout(() => dialog!.close(), FADE_MS);
  }

  document.addEventListener("click", (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-gallery]");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    open(link);
  });

  // Start fetching the full screenshot as soon as the pointer or focus is on
  // its thumbnail, so it is usually ready by the time the viewer opens.
  const fetched = new Set<string>();
  const prefetch = (event: Event) => {
    const link = (event.target as HTMLElement).closest?.<HTMLAnchorElement>("a[data-gallery]");
    if (!link || fetched.has(link.href) || saveData) return;
    fetched.add(link.href);
    new Image().src = link.href;
  };
  document.addEventListener("pointerover", prefetch, { passive: true });
  document.addEventListener("focusin", prefetch);

  prev.addEventListener("click", () => show(index - 1, -1));
  next.addEventListener("click", () => show(index + 1, 1));
  close.addEventListener("click", shut);

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(index - 1, -1);
    if (event.key === "ArrowRight") show(index + 1, 1);
    if (event.key === "Escape") {
      event.preventDefault();
      shut();
    }
  });

  // Escape that reaches the browser as a close request also fades out.
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    shut();
  });

  // A click on the dark area around the image closes the viewer.
  dialog.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target === dialog || target.classList.contains("lightbox-panel") || target.classList.contains("lightbox-bar")) {
      shut();
    }
  });

  dialog.addEventListener("close", () => {
    window.clearTimeout(closing);
    closing = 0;
    ++shown;
    if (session) {
      session.kill();
      session = null;
      gsap!.set([dialog, img, ...chrome], { clearProps: "all" });
    }
    delete dialog.dataset.state;
    img.removeAttribute("src");
    opener?.focus({ preventScroll: true });
  });

  // Swipe between screenshots on touch screens.
  let startX = 0;
  dialog.addEventListener("touchstart", (event) => (startX = event.touches[0]!.clientX), { passive: true });
  dialog.addEventListener(
    "touchend",
    (event) => {
      const dx = event.changedTouches[0]!.clientX - startX;
      if (Math.abs(dx) > 50 && items.length > 1) {
        const step = dx < 0 ? 1 : -1;
        show(index + step, step);
      }
    },
    { passive: true },
  );
}
