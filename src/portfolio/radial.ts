import { initThemeToggle } from "../scripts/theme";
import { storedChoice } from "../scripts/motion-preference";
import type { LabProject } from "./projects";

type Category = { id: string; label: string; projects: Omit<LabProject, "image" | "alt">[] };
type GsapApi = typeof import("gsap").gsap;
type Tween = ReturnType<GsapApi["to"]>;

export function initRadial() {
  const root = document.querySelector<HTMLElement>("[data-radial]");
  if (!root || root.dataset.enhanced) return;
  const data = JSON.parse(root.querySelector("[data-project-data]")!.textContent!) as { categories: Category[]; of: string };
  const stage = root.querySelector<HTMLElement>("[data-stage]")!;
  const panels = [...root.querySelectorAll<HTMLElement>("[data-panel]")];
  const buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-category]")];
  const categoryControl = root.querySelector<HTMLElement>(".radial-categories")!;
  const previous = root.querySelector<HTMLButtonElement>("[data-previous]")!;
  const next = root.querySelector<HTMLButtonElement>("[data-next]")!;
  const announce = root.querySelector<HTMLElement>("[data-announcement]")!;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const controller = new AbortController();
  const { signal } = controller;
  const shouldReduce = () => storedChoice() ? storedChoice() === "off" : motion.matches;
  let reduced = shouldReduce();
  let categoryIndex = 0;
  const selected = data.categories.map(() => 0);
  const rotation = { position: 0 };
  let targetPosition = 0;
  let width = stage.clientWidth;
  let tween: Tween | undefined;
  let gsap: GsapApi | undefined;
  let disposed = false;
  let gesture: { id: number; x: number; y: number; start: number; dragging: boolean } | undefined;
  let frame = 0;
  let wheelSum = 0;
  let wheelLast = -Infinity;
  let wheelDirection = 0;
  let wheelConsumed = false;
  let wheelLockUntil = -Infinity;
  const group = () => data.categories[categoryIndex]!;
  const cards = () => [...panels[categoryIndex]!.querySelectorAll<HTMLElement>("[data-card]")];
  function resetWheel() {
    wheelSum = 0; wheelLast = -Infinity; wheelDirection = 0;
    wheelConsumed = false; wheelLockUntil = -Infinity;
  }

  // Measured only on category changes and resize/font layout, never on wheel.
  function positionCategoryIndicator() {
    const track = categoryControl.getBoundingClientRect();
    const button = buttons[categoryIndex]!.getBoundingClientRect();
    const inset = parseFloat(getComputedStyle(categoryControl).getPropertyValue("--segment-inset")) + categoryControl.clientLeft;
    const left = Math.max(0, button.left - track.left - inset);
    const right = Math.max(0, track.width - 2 * inset - left - button.width);
    categoryControl.style.setProperty("--segment-left", `${left}px`);
    categoryControl.style.setProperty("--segment-right", `${right}px`);
    categoryControl.dataset.indicatorReady = "true";
  }

  // A tilted elliptical orbit: front at 0, rear above and deeper into the page.
  // With two items the antipodal card has its own rear position, never a clone.
  function render() {
    const items = cards();
    const radiusX = Math.min(210, width * .27);
    const radiusY = width < 400 ? 32 : 49;
    const depth = width < 400 ? 95 : 130;
    items.forEach((card, i) => {
      const angle = (i - rotation.position) * Math.PI * 2 / items.length;
      const front = Math.cos(angle);
      const sine = Math.sin(angle);
      const offset = items.length === 2 ? .47 : .17;
      const x = reduced ? 0 : sine * radiusX + (1 - front) * radiusX * offset;
      const y = reduced ? 0 : (front - 1) * radiusY;
      const z = reduced ? 0 : (front - 1) * depth;
      const tilt = reduced ? 0 : sine * 17 + (1 - front) * 5;
      const turn = reduced ? 0 : -sine * 17;
      const scale = reduced ? 1 : .91 + .09 * (front + 1) / 2;
      card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${turn.toFixed(2)}deg) rotateZ(${tilt.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      card.style.opacity = reduced ? "1" : String(.55 + .45 * (front + 1) / 2);
      card.style.zIndex = String(Math.round((front + 1) * 100));
    });
  }

  function describe() {
    const current = selected[categoryIndex]!;
    const project = group().projects[current]!;
    root!.querySelector("[data-kind]")!.textContent = project.kind;
    root!.querySelector("[data-name]")!.textContent = project.name;
    root!.querySelector("[data-description]")!.textContent = project.description;
    const techs = root!.querySelector("[data-technologies]")!;
    techs.replaceChildren(...project.technologies.map((technology) => {
      const li = document.createElement("li"); li.textContent = technology; return li;
    }));
    const explore = root!.querySelector<HTMLAnchorElement>("[data-explore]")!;
    explore.href = project.href;
    explore.querySelector("span")!.textContent = project.action;
    root!.querySelector<HTMLAnchorElement>("[data-code]")!.href = project.repo;
    root!.querySelector("[data-position]")!.textContent = `${String(current + 1).padStart(2, "0")} / ${String(group().projects.length).padStart(2, "0")}`;
    announce.textContent = `${project.name}, ${current + 1} ${data.of} ${group().projects.length}`;
    root!.dataset.selected = project.id;
    previous.disabled = current === 0;
    next.disabled = current === group().projects.length - 1;
    cards().forEach((card, i) => {
      const active = i === current;
      card.inert = !active;
      card.setAttribute("aria-hidden", String(!active));
      card.toggleAttribute("data-active", active);
    });
  }

  function settle() {
    tween?.kill();
    rotation.position = targetPosition;
    render();
  }

  function travel(target: number) {
    tween?.kill();
    targetPosition = Math.max(0, Math.min(group().projects.length - 1, target));
    selected[categoryIndex] = targetPosition;
    describe();
    if (reduced || !gsap) { settle(); return; }
    tween = gsap.to(rotation, { position: targetPosition, duration: .62, ease: "power3.out", overwrite: true, onUpdate: render });
  }

  const step = (direction: number) => travel(targetPosition + direction);
  function chooseCategory(index: number) {
    if (index === categoryIndex) return;
    tween?.kill();
    gesture = undefined;
    cancelAnimationFrame(frame);
    frame = 0;
    categoryIndex = index;
    targetPosition = selected[index]!;
    rotation.position = targetPosition;
    resetWheel();
    panels.forEach((panel, i) => { panel.hidden = i !== index; panel.inert = i !== index; });
    buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    positionCategoryIndicator();
    describe(); render();
  }

  async function loadMotion() {
    if (gsap || reduced || disposed) return;
    try {
      const module = await import("gsap");
      if (!disposed) gsap = module.gsap;
    } catch { /* Instant navigation is a complete fallback, not a hidden scene. */ }
  }

  function applyMotion() {
    reduced = shouldReduce();
    root!.toggleAttribute("data-reduced", reduced);
    root!.querySelector<HTMLElement>(".radial-reduced")!.hidden = !reduced;
    gesture = undefined; cancelAnimationFrame(frame); frame = 0; settle();
    if (!reduced) void loadMotion();
  }

  // A single, scene-local consumer. Never lock the document or synthesize scroll.
  // One continuous burst owns at most one step, including its momentum tail.
  stage.addEventListener("wheel", (event) => {
    if (event.ctrlKey || event.metaKey || event.defaultPrevented || !event.cancelable || gesture) return;
    if (event.target instanceof Element && event.target.closest("a, button, input, textarea, select, [contenteditable], [data-wheel-native]")) return;
    const raw = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!Number.isFinite(raw) || raw === 0) return;
    const direction = Math.sign(raw);
    const now = performance.now();
    // Require both a quiet gap and completion of the owned step. A pause inside
    // an animation is not permission to skip another project or leak page scroll.
    if (now - wheelLast > 240 && now >= wheelLockUntil) {
      wheelSum = 0; wheelConsumed = false; wheelDirection = direction;
    }
    wheelLast = now;
    if (wheelConsumed) { event.preventDefault(); return; }
    const current = selected[categoryIndex]!;
    const atEdge = direction < 0 ? current === 0 : current === group().projects.length - 1;
    // A NEW outward gesture at either end belongs to the page. No wrapping.
    if (atEdge) { wheelSum = 0; return; }
    event.preventDefault();
    if (direction !== wheelDirection) { wheelSum = 0; wheelDirection = direction; }
    // Normalize line/page wheels; accumulate fractional pixel trackpad deltas.
    wheelSum += Math.abs(raw) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 80 : 1);
    if (wheelSum >= 36) {
      wheelConsumed = true;
      wheelLockUntil = now + 640;
      step(direction);
    }
  }, { passive: false, signal });
  stage.addEventListener("keydown", (event) => {
    if (event.target !== stage || event.altKey || event.ctrlKey || event.metaKey) return;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => step(-1), ArrowRight: () => step(1),
      Home: () => travel(0),
      End: () => travel(group().projects.length - 1),
    };
    if (actions[event.key]) { event.preventDefault(); resetWheel(); actions[event.key]!(); }
  }, { signal });
  previous.addEventListener("click", () => { resetWheel(); step(-1); }, { signal });
  next.addEventListener("click", () => { resetWheel(); step(1); }, { signal });
  buttons.forEach((button, index) => button.addEventListener("click", () => chooseCategory(index), { signal }));

  stage.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    resetWheel();
    settle();
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, start: targetPosition, dragging: false };
  }, { passive: true, signal });
  stage.addEventListener("pointermove", (event) => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.dragging && Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { gesture = undefined; return; }
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      gesture.dragging = true;
      if (!stage.hasPointerCapture(event.pointerId)) stage.setPointerCapture(event.pointerId);
    }
    if (!gesture.dragging || reduced) return;
    rotation.position = gesture.start - Math.max(-1, Math.min(1, dx / Math.max(160, width * .55)));
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; render(); });
  }, { passive: true, signal });
  stage.addEventListener("pointerup", (event) => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    const start = gesture.start;
    const advance = gesture.dragging && Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.25;
    gesture = undefined;
    cancelAnimationFrame(frame); frame = 0;
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    travel(start + (advance ? -Math.sign(dx) : 0));
  }, { passive: true, signal });
  const cancelGesture = () => { if (gesture) { gesture = undefined; cancelAnimationFrame(frame); frame = 0; settle(); } };
  stage.addEventListener("pointercancel", cancelGesture, { signal });
  stage.addEventListener("lostpointercapture", (event) => {
    // Touch has implicit capture on the original child. Its bubbled loss when
    // capture transfers to the stage must not cancel the stage's own gesture.
    if (event.target === stage && !stage.hasPointerCapture(event.pointerId)) cancelGesture();
  }, { signal });
  window.addEventListener("blur", cancelGesture, { signal });
  document.addEventListener("visibilitychange", () => { if (document.hidden) { cancelGesture(); settle(); } }, { signal });
  motion.addEventListener("change", applyMotion, { signal });
  document.addEventListener("motionsettingchange", applyMotion, { signal });
  window.addEventListener("storage", (event) => { if (event.key === "luisdataworks:motion") applyMotion(); }, { signal });
  const resize = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === stage) { width = entry.contentRect.width; render(); }
      if (entry.target === categoryControl) positionCategoryIndicator();
    }
  });
  resize.observe(stage);
  resize.observe(categoryControl);

  initThemeToggle("[data-lab-theme]", false);

  root.dataset.enhanced = "true";
  root.setAttribute("aria-roledescription", document.documentElement.lang === "es" ? "carrusel" : "carousel");
  stage.tabIndex = 0;
  root.querySelector<HTMLElement>(".radial-categories")!.hidden = false;
  root.querySelector<HTMLElement>(".radial-navigation")!.hidden = false;
  root.querySelector<HTMLElement>(".radial-help")!.hidden = false;
  root.querySelector<HTMLElement>("[data-detail]")!.hidden = false;
  panels.forEach((panel, i) => { panel.hidden = i !== 0; panel.inert = i !== 0; });
  describe(); applyMotion(); positionCategoryIndicator();
  document.fonts.ready.then(() => { if (!disposed) positionCategoryIndicator(); });

  const cleanup = () => {
    disposed = true; controller.abort(); resize.disconnect(); tween?.kill(); cancelAnimationFrame(frame);
  };
  // Cleanup before Astro navigation; full-page navigation is handled by the browser.
  document.addEventListener("astro:before-swap", cleanup, { once: true, signal });
  window.addEventListener("pagehide", (event) => { if (!event.persisted) cleanup(); else settle(); }, { signal });
}
