// Shared Liquid Glass material. Progressive layers:
//   1. CSS material for every engine: tint, frost, specular rim, thickness,
//      adaptive shadow and light that starts at the pointer on press.
//   2. Chromium only: edge refraction ("lensing"). Each control gets its own
//      SVG filter whose displacement map is computed for its exact size and
//      corner radius, then applied through `backdrop-filter: url(#id)`.
// Nothing animates continuously: maps are rebuilt only on resize, and motion
// happens only in response to the visitor (press, selection, scroll state).

import { motionAllowed } from "../scripts/motion-preference";

import { createLabScope } from "./lifecycle";
let scope = createLabScope();
let initialized = false;

type Material = "flat" | "css" | "lens" | "clear";
type Lens = {
  el: HTMLElement;
  filter: SVGFilterElement;
  image: SVGFEImageElement;
  displace: SVGFEDisplacementMapElement;
  blur: SVGFEGaussianBlurElement;
  depth: number;
  width: number;
  height: number;
};

const SVG = "http://www.w3.org/2000/svg";
const root = document.documentElement;
const lenses = new Map<HTMLElement, Lens>();
let defs: SVGDefsElement | undefined;
let strength = 1;
let counter = 0;
// "clear": the nearly colourless variant (Apple's Clear). Same lens, almost no
// frost, a deeper edge bend; legibility comes from adaptive contrast instead.
let clearMode = false;
const CLEAR_DEPTH = 1.45;
// Per element too: .lg--clear makes one control clear while others keep their
// own material (e.g. a frosted bar with clear carousel controls).
const isClear = (el: HTMLElement) => clearMode || el.classList.contains("lg--clear");
const frostOf = (el: HTMLElement) => (isClear(el) ? el.dataset.lgClearFrost ?? "0.35" : el.dataset.lgFrost ?? "1.2");

/** Edge refraction needs SVG filters inside backdrop-filter: Chromium only. */
export function lensSupported(): boolean {
  const data = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData;
  return !!data?.brands.some((b) => b.brand === "Chromium") && CSS.supports("backdrop-filter", "url(#a)");
}

/**
 * A displacement map for a rounded rectangle. Inside a bezel band near the
 * edge, each pixel samples the backdrop from further inside, along the edge
 * normal, with a smooth falloff: the light bends at the rim and the centre
 * stays undistorted, like a thick convex glass edge. R = x, G = y, 128 = none.
 */
function displacementMap(w: number, h: number, radius: number, bezel: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext("2d")!;
  const image = context.createImageData(w, h);
  const data = image.data;
  const hw = w / 2;
  const hh = h / 2;
  const r = Math.min(radius, hw, hh);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - hw;
      const py = y + 0.5 - hh;
      const qx = Math.abs(px) - (hw - r);
      const qy = Math.abs(py) - (hh - r);
      const distance = -(Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r);
      let nx = 0;
      let ny = 0;
      let m = 0;
      if (distance > 0 && distance < bezel) {
        if (qx > 0 && qy > 0) {
          const length = Math.hypot(qx, qy) || 1;
          nx = (Math.sign(px) * qx) / length;
          ny = (Math.sign(py) * qy) / length;
        } else if (qx > qy) nx = Math.sign(px);
        else ny = Math.sign(py);
        // Squircle-like profile: steep at the rim, flat towards the centre.
        const t = 1 - distance / bezel;
        m = t * t * (1.6 - 0.6 * t);
      }
      const i = (y * w + x) * 4;
      data[i] = Math.round(128 - nx * m * 127);
      data[i + 1] = Math.round(128 - ny * m * 127);
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

function ensureDefs(): SVGDefsElement {
  if (defs) return defs;
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  Object.assign(svg.style, { position: "absolute", width: "0", height: "0", overflow: "hidden", pointerEvents: "none" });
  defs = document.createElementNS(SVG, "defs");
  svg.append(defs);
  document.body.append(svg);
  return defs;
}

function createLens(el: HTMLElement): Lens {
  const id = `lg-lens-${++counter}`;
  const filter = document.createElementNS(SVG, "filter");
  filter.id = id;
  filter.setAttribute("color-interpolation-filters", "sRGB");
  filter.setAttribute("filterUnits", "userSpaceOnUse");
  filter.setAttribute("primitiveUnits", "userSpaceOnUse");
  const blur = document.createElementNS(SVG, "feGaussianBlur");
  blur.setAttribute("in", "SourceGraphic");
  blur.setAttribute("result", "frost");
  const image = document.createElementNS(SVG, "feImage");
  image.setAttribute("result", "map");
  image.setAttribute("preserveAspectRatio", "none");
  const displace = document.createElementNS(SVG, "feDisplacementMap");
  displace.setAttribute("in", "frost");
  displace.setAttribute("in2", "map");
  displace.setAttribute("xChannelSelector", "R");
  displace.setAttribute("yChannelSelector", "G");
  displace.setAttribute("result", "bent");
  // Saturation and brightness stay in CSS, so both materials share them.
  filter.append(blur, image, displace);
  ensureDefs().append(filter);
  el.style.setProperty("--lg-lens", `url(#${id})`);
  return { el, filter, image, displace, blur, depth: Number(el.dataset.lgDepth ?? 10), width: 0, height: 0 };
}

/** Cheap: keeps the filter region and the (stretched) map on the element. */
function fit(lens: Lens): [number, number] {
  const w = Math.round(lens.el.offsetWidth);
  const h = Math.round(lens.el.offsetHeight);
  if (w && h) {
    for (const node of [lens.filter, lens.image]) {
      node.setAttribute("x", "0");
      node.setAttribute("y", "0");
      node.setAttribute("width", String(w));
      node.setAttribute("height", String(h));
    }
  }
  return [w, h];
}

/** Costly: recomputes the displacement map for the current size. */
function rebuild(lens: Lens) {
  const { el } = lens;
  const [w, h] = fit(lens);
  if (!w || !h || (w === lens.width && h === lens.height)) return;
  lens.width = w;
  lens.height = h;
  const style = getComputedStyle(el);
  const radius = parseFloat(style.borderTopLeftRadius) || h / 2;
  const bezel = Math.min(Number(el.dataset.lgBezel ?? 16), w / 2, h / 2);
  lens.image.setAttribute("href", displacementMap(w, h, radius, bezel));
  lens.blur.setAttribute("stdDeviation", frostOf(el));
  setScale(lens, 1);
}

function setScale(lens: Lens, progress: number) {
  const mode = isClear(lens.el) ? CLEAR_DEPTH : 1;
  lens.displace.setAttribute("scale", String((2 * lens.depth * strength * mode * progress).toFixed(2)));
}

/** Glass materializes by bringing its lensing in, not by fading (WWDC25). */
function materialize(lens: Lens) {
  if (!motionAllowed()) return setScale(lens, 1);
  const start = performance.now();
  const step = (now: number) => {
    if (!motionAllowed()) { setScale(lens, 1); return; }
    const t = Math.min(1, (now - start) / 520);
    setScale(lens, 1 - Math.pow(1 - t, 3));
    if (t < 1) scope.frame(step);
  };
  setScale(lens, 0);
  scope.frame(step);
}

// A map costs tens of milliseconds for a wide bar, so during a live resize it
// is rebuilt once the size settles; meanwhile the old map simply stretches
// (feImage uses preserveAspectRatio="none"). The first build is immediate.
const pending = new Map<Lens, number>();
const resize = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const lens = lenses.get(entry.target as HTMLElement);
    if (!lens) continue;
    if (!lens.width) { rebuild(lens); continue; }
    fit(lens);
    scope.cancelDelay(pending.get(lens));
    pending.set(lens, scope.delay(() => rebuild(lens), 160));
  }
});

function enableLenses() {
  document.querySelectorAll<HTMLElement>("[data-lg]").forEach((el) => {
    if (lenses.has(el)) return;
    const lens = createLens(el);
    lenses.set(el, lens);
    rebuild(lens);
    resize.observe(el);
    if (el.checkVisibility?.() !== false) materialize(lens);
  });
}

export function setMaterial(material: Material) {
  const lens = (material === "lens" || material === "clear") && lensSupported();
  clearMode = material === "clear";
  // Clear keeps its own tokens even without the lens (then: CSS clear glass).
  root.dataset.material = clearMode ? "clear" : lens ? "lens" : material === "flat" ? "flat" : "css";
  if (lens) enableLenses();
  lenses.forEach((item) => {
    item.blur.setAttribute("stdDeviation", frostOf(item.el));
    setScale(item, 1);
  });
  if (clearMode || document.querySelector(".lg--clear")) startAdaptiveContrast();
  else stopAdaptiveContrast();
}

/* ---------- Adaptive contrast (clear variant) ----------
   Clear glass has no tint to protect its labels, so each glass element looks
   at what is behind it and flips its text and its local dimming between
   light and dark, as small Liquid Glass controls do. It reads computed
   background colours and, for images, a cached 32x32 copy of the picture.
   Runs only on scroll/resize, throttled to one pass per frame. */

const imageCache = new WeakMap<HTMLImageElement, ImageData | null>();
let adaptiveOn = false;
let adaptiveFrame = 0;

function luminance(r: number, g: number, b: number) {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function imageLuminance(img: HTMLImageElement, x: number, y: number): number | null {
  if (!img.complete || !img.naturalWidth) return null;
  let data = imageCache.get(img);
  if (data === undefined) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 32;
      const context = canvas.getContext("2d", { willReadFrequently: true })!;
      context.drawImage(img, 0, 0, 32, 32);
      data = context.getImageData(0, 0, 32, 32);
    } catch {
      data = null; // Cross-origin picture: fall back to the surroundings.
    }
    imageCache.set(img, data);
  }
  if (!data) return null;
  const box = img.getBoundingClientRect();
  let left = box.left, top = box.top, width = box.width, height = box.height;
  // A compact screenshot is contained, not stretched: its letterbox belongs
  // to the surrounding surface. Sampling the image there could hide a clear
  // control's icon against a dark gutter beside a light screenshot.
  const style = getComputedStyle(img);
  if (style.objectFit === "contain" && style.objectPosition === "50% 50%") {
    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
    const paintedWidth = img.naturalWidth * scale, paintedHeight = img.naturalHeight * scale;
    left += (width - paintedWidth) / 2; top += (height - paintedHeight) / 2;
    width = paintedWidth; height = paintedHeight;
    if (x < left || x > left + width || y < top || y > top + height) return null;
  }
  if (!width || !height) return null;
  const px = Math.min(31, Math.max(0, Math.floor(((x - left) / width) * 32)));
  const py = Math.min(31, Math.max(0, Math.floor(((y - top) / height) * 32)));
  const i = (py * 32 + px) * 4;
  return luminance(data.data[i]!, data.data[i + 1]!, data.data[i + 2]!);
}

function surfaceLuminance(start: Element | null): number {
  for (let node: Element | null = start; node; node = node.parentElement) {
    const match = getComputedStyle(node).backgroundColor.match(/[\d.]+/g);
    if (match && (match[3] === undefined || Number(match[3]) > 0.5)) return luminance(+match[0]!, +match[1]!, +match[2]!);
  }
  return root.dataset.theme === "dark" ? 0.004 : 0.95;
}

function sampleBehind(el: HTMLElement): number {
  const box = el.getBoundingClientRect();
  const y = box.top + box.height / 2;
  const xs = box.width > 120 ? [box.left + box.width * 0.18, box.left + box.width / 2, box.right - box.width * 0.18] : [box.left + box.width / 2];
  let total = 0;
  for (const x of xs) {
    const behind = document.elementsFromPoint(x, y).find((node) => !el.contains(node) && !node.closest(".lg, .edge, .pf-edge, .panel, [data-lg-top]"));
    const value = behind instanceof HTMLImageElement ? imageLuminance(behind, x, y) : null;
    total += value ?? surfaceLuminance(behind ?? null);
  }
  return total / xs.length;
}

const solidPrefs = [matchMedia("(prefers-reduced-transparency: reduce)"), matchMedia("(prefers-contrast: more)"), matchMedia("(forced-colors: active)")];
function adaptPass() {
  adaptiveFrame = 0;
  // Reduced transparency, more contrast or forced colours make the glass a
  // solid surface: its own text colour must win, so nothing flips.
  const [lessTransparency, moreContrast, forced] = solidPrefs.map((query) => query.matches);
  if ((lessTransparency && !root.hasAttribute("data-ignore-rt")) || moreContrast || forced) {
    document.querySelectorAll<HTMLElement>("[data-lg][data-under]").forEach((el) => delete el.dataset.under);
    return;
  }
  document.querySelectorAll<HTMLElement>(clearMode ? "[data-lg]" : "[data-lg].lg--clear").forEach((el) => {
    if (!el.getClientRects().length) return;
    const value = sampleBehind(el);
    // Narrow hysteresis band (no flicker) chosen for contrast: at its edges,
    // light text over a backdrop dimmed to 68% stays above ~4:1 and dark text
    // over a backdrop brightened by 8% above ~5:1, before the halo helps.
    if (value < 0.22) el.dataset.under = "dark";
    else if (value > 0.28) el.dataset.under = "light";
    else el.dataset.under ??= root.dataset.theme === "dark" ? "dark" : "light";
  });
}
// At most one pass every ~80 ms while scrolling, plus a trailing pass when
// it stops: measured cheaper than one per frame, still reacts within a beat.
let lastAdapt = 0;
let trailing = 0;
const scheduleAdapt = () => {
  if (!adaptiveOn) return;
  scope.cancelDelay(trailing);
  trailing = scope.delay(() => scope.frame(adaptPass), 120);
  if (adaptiveFrame || performance.now() - lastAdapt < 80) return;
  adaptiveFrame = scope.frame(() => {
    lastAdapt = performance.now();
    adaptPass();
  });
};
let adaptiveBound = false;
function startAdaptiveContrast() {
  if (adaptiveOn) return;
  adaptiveOn = true;
  if (adaptiveBound) { scheduleAdapt(); return; }
  adaptiveBound = true;
  scope.listen(window, "scroll", scheduleAdapt, { passive: true });
  scope.listen(window, "resize", scheduleAdapt);
  scope.listen(document, "click", scheduleAdapt); // carousel and theme changes
  scope.observe(new MutationObserver(scheduleAdapt)).observe(root, { attributes: true, attributeFilter: ["data-theme", "data-ignore-rt"] });
  solidPrefs.forEach((query) => scope.listen(query, "change", scheduleAdapt));
  scheduleAdapt();
}
function stopAdaptiveContrast() {
  adaptiveOn = false;
  document.querySelectorAll<HTMLElement>("[data-lg][data-under]").forEach((el) => delete el.dataset.under);
}

export function setStrength(value: number) {
  strength = value;
  lenses.forEach((lens) => setScale(lens, 1));
}

/** Light starts under the pointer (or the centre for keys) and spreads. */
function bindPress(el: HTMLElement) {
  scope.onDispose(() => { delete el.dataset.pressed; el.style.removeProperty("--lg-hx"); });
  const light = (x: number, y: number) => {
    el.style.setProperty("--lg-px", `${x}px`);
    el.style.setProperty("--lg-py", `${y}px`);
    el.dataset.pressed = "";
  };
  const release = () => delete el.dataset.pressed;
  scope.listen(el, "pointerdown", (event) => {
    if ((el as HTMLButtonElement).disabled) return;
    const box = el.getBoundingClientRect();
    light(event.clientX - box.left, event.clientY - box.top);
  });
  scope.listen(el, "keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") light(el.offsetWidth / 2, el.offsetHeight / 2);
  });
  for (const type of ["pointerup", "pointercancel", "pointerleave", "keyup", "blur"]) scope.listen(el, type, release);
  // The resting highlight leans gently towards a fine pointer while it hovers.
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let frame = 0;
    scope.listen(el, "pointermove", (event) => {
      if (frame || !motionAllowed()) return;
      frame = scope.frame(() => {
        frame = 0;
        const box = el.getBoundingClientRect();
        el.style.setProperty("--lg-hx", `${(((event.clientX - box.left) / box.width) * 100).toFixed(1)}%`);
      });
    });
    scope.listen(el, "pointerleave", () => el.style.removeProperty("--lg-hx"));
  }
}

/** A segmented control whose selection capsule slides and briefly flexes. */
function bindSegmented(group: HTMLElement) {
  const owner = scope;
  scope.onDispose(() => { delete group.dataset.moving; delete group.dataset.ready; });
  const capsule = group.querySelector<HTMLElement>(".lg-capsule")!;
  const buttons = [...group.querySelectorAll<HTMLButtonElement>("button")];
  const place = (animate: boolean) => {
    const active = buttons.find((b) => b.getAttribute("aria-pressed") === "true") ?? buttons[0]!;
    capsule.style.width = `${active.offsetWidth}px`;
    capsule.style.translate = `${active.offsetLeft}px 0`;
    if (!animate || !motionAllowed()) return;
    scope.animate(capsule,
      [{ scale: "1 1" }, { scale: "1.07 0.9", offset: 0.35 }, { scale: "0.99 1.02", offset: 0.7 }, { scale: "1 1" }],
      { duration: 460, easing: "cubic-bezier(.2, .8, .2, 1)" },
    );
    group.dataset.moving = "";
    scope.delay(() => delete group.dataset.moving, 420);
  };
  buttons.forEach((button) =>
    scope.listen(button, "click", () => {
      if (button.getAttribute("aria-pressed") === "true") return;
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      place(true);
    }),
  );
  scope.observe(new ResizeObserver(() => place(false))).observe(group);
  document.fonts.ready.then(() => { if (!owner.disposed) place(false); });
  place(false);
  scope.frame(() => (group.dataset.ready = ""));
}

export function initLiquidGlass() {
  if (initialized && !scope.disposed) return;
  if (scope.disposed) scope = createLabScope();
  initialized = true;
  scope.observe(resize);
  scope.onDispose(() => {
    lenses.forEach(lens => { lens.el.style.removeProperty("--lg-lens"); delete lens.el.dataset.pressed; delete lens.el.dataset.moving; });
    lenses.clear(); pending.clear();
    defs?.parentElement?.remove(); defs = undefined;
    adaptiveOn = false; adaptiveBound = false; adaptiveFrame = 0; trailing = 0; lastAdapt = 0;
    initialized = false;
  });
  // Lensed glass and the thin overlays that live on it share the same press.
  document.querySelectorAll<HTMLElement>("[data-lg]:is(a, button), [data-lg-press]").forEach(bindPress);
  document.querySelectorAll<HTMLElement>("[data-lg-segmented] button").forEach(bindPress);
  document.querySelectorAll<HTMLElement>("[data-lg-segmented]").forEach(bindSegmented);
  // A selector driven by its own controller (the carousel's categories): only
  // the brief "lift" while the selection travels; position stays theirs.
  document.querySelectorAll<HTMLElement>("[data-lg-flex]").forEach((group) => {
    let timer = 0;
    scope.listen(group, "click", (event) => {
      const button = (event.target as Element).closest("button");
      if (!button || button.getAttribute("aria-pressed") === "true" || !motionAllowed()) return;
      group.dataset.moving = "";
      scope.cancelDelay(timer);
      timer = scope.delay(() => delete group.dataset.moving, 420);
      // The capsule (the host's ::before, positioned by its own controller)
      // stretches while it slides, like the demo's segmented control. Its
      // origin follows the new position, read once the controller has set it.
      scope.frame(() => {
        const style = getComputedStyle(group);
        const left = parseFloat(style.getPropertyValue("--segment-left")) || 0;
        const right = parseFloat(style.getPropertyValue("--segment-right")) || 0;
        const inset = parseFloat(style.getPropertyValue("--segment-inset")) || 0;
        const width = group.clientWidth - 2 * inset - left - right;
        group.style.setProperty("--capsule-origin", `${inset + left + width / 2}px`);
        scope.animate(group,
          [{ scale: "1 1" }, { scale: "1.06 0.9", offset: 0.35 }, { scale: "0.99 1.02", offset: 0.7 }, { scale: "1 1" }],
          { duration: 460, easing: "cubic-bezier(.2, .8, .2, 1)", pseudoElement: "::before" },
        );
      });
    }, { capture: true });
  });

  // As content scrolls under the bar, its shadow and tint deepen (WWDC25).
  const bar = document.querySelector<HTMLElement>("[data-lg-bar]");
  const top = document.querySelector<HTMLElement>("[data-lg-top]");
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    scope.frame(() => {
      ticking = false;
      bar?.toggleAttribute("data-scrolled", scrollY > 8);
      if (top) {
        const shown = scrollY > 700;
        if (shown !== top.hasAttribute("data-shown")) {
          top.toggleAttribute("data-shown", shown);
          top.inert = !shown;
          const lens = lenses.get(top);
          if (shown && lens) materialize(lens);
        }
      }
    });
  };
  scope.listen(window, "scroll", onScroll, { passive: true });
  onScroll();
  if (top) scope.listen(top, "click", () => scrollTo({ top: 0, behavior: motionAllowed() ? "smooth" : "auto" }));
  scope.listen(document, "motionchange", () => {
    if (!motionAllowed()) scope.cancelAnimations();
    lenses.forEach((lens) => setScale(lens, 1));
  });
}

/** Existing controls can become visible in a dialog or change their backdrop. */
export function refreshLiquidGlass() {
  if (!initialized || scope.disposed) return;
  lenses.forEach(lens => { if (lens.el.getClientRects().length) rebuild(lens); });
  scheduleAdapt();
}

export function disposeLiquidGlass() { scope.dispose(); }
