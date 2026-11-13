import { motionAllowed } from "../scripts/motion-preference";

/** A CSS <time> ("400ms" or ".4s") in milliseconds; NaN when unreadable. */
const toMs = (value: string) => {
  const time = value.trim();
  const amount = parseFloat(time);
  return /ms$/i.test(time) ? amount : /s$/i.test(time) ? amount * 1000 : amount;
};

// Wrap the existing lab theme click handler; it still owns application/storage.
// No second theme state, storage key, palette catalogue or carousel controller.
export function initCircularThemeReveal() {
  const button = document.querySelector<HTMLButtonElement>("[data-lab-theme]");
  if (!button || button.dataset.revealReady) return;
  button.dataset.revealReady = "true";
  const root = document.documentElement;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const controller = new AbortController();
  const { signal } = controller;
  let busy = false;
  let disposed = false;
  let transition: ViewTransition | undefined;
  let animation: Animation | undefined;

  const commit = () => {
    // Invoke the same owned handler without recursively clicking a button
    // whose native keyboard activation may still be in progress.
    button.dispatchEvent(new Event("lab:theme-toggle"));
  };
  // The site's motion setting (system or the visitor's explicit choice).
  const instant = () => !motionAllowed() || !!document.querySelector("[data-radial][data-reduced]");
  // While the theme flips, CSS colour transitions are suspended (see
  // [data-theme-transition] in portfolio.css): otherwise glass and buttons
  // would keep fading after the circle has finished, like a second change.
  const instantCommit = () => {
    root.dataset.themeTransition = "instant";
    commit();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (root.dataset.themeTransition === "instant") delete root.dataset.themeTransition;
    }));
  };
  const finish = () => {
    animation?.finish();
    transition?.skipTransition();
  };

  button.addEventListener("click", async (event) => {
    // This capture listener wraps, rather than duplicates, the original handler.
    event.stopImmediatePropagation();
    if (busy || disposed) return;
    if (instant() || !document.startViewTransition || !CSS.supports("clip-path", "circle(1px at 0 0)")) {
      instantCommit(); return;
    }
    busy = true;
    button.setAttribute("aria-busy", "true");
    root.dataset.themeTransition = "active";
    const box = button.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const style = getComputedStyle(root);
    const radius = Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))) + 2;
    let applied = false;
    const update = () => { if (!applied && !disposed) { applied = true; commit(); } };
    try {
      transition = document.startViewTransition(update);
      // Attach both rejection handlers immediately: a skipped transition may
      // reject ready while the DOM update still succeeds.
      const ready = transition.ready.then(() => true, () => false);
      const finished = transition.finished.catch(() => {});
      const updated = transition.updateCallbackDone.catch(() => {});
      if (await ready) {
        if (instant() || disposed) transition.skipTransition();
        else {
          animation = root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, {
            // Measured: capture ~25 ms, first frame ~50 ms; the old 600 ms with an
            // expo-out curve left the far corners crawling for ~400 ms.
            // The CSS minifier rewrites 400ms as .4s, so read the unit too.
            duration: toMs(style.getPropertyValue("--theme-reveal-duration")) || 400,
            easing: style.getPropertyValue("--theme-reveal-ease").trim() || "cubic-bezier(.4, 0, .2, 1)",
            pseudoElement: "::view-transition-new(root)",
            fill: "both",
          });
          await animation.finished.catch(() => {});
        }
      }
      await updated; await finished;
      if (!applied && !disposed) update();
    } catch {
      transition?.skipTransition();
      if (!applied && !disposed) update();
    } finally {
      // Release the filled WAAPI effect after the browser removes its snapshots.
      animation?.cancel();
      animation = undefined; transition = undefined;
      delete root.dataset.themeTransition;
      button.removeAttribute("aria-busy");
      busy = false;
    }
  }, { capture: true, signal });
  motion.addEventListener("change", () => { if (!motionAllowed()) finish(); }, { signal });
  document.addEventListener("motionchange", () => { if (!motionAllowed()) finish(); }, { signal });
  window.addEventListener("resize", finish, { signal });
  const cleanup = () => { disposed = true; finish(); controller.abort(); };
  document.addEventListener("astro:before-swap", cleanup, { once: true, signal });
  window.addEventListener("pagehide", (event) => { if (!event.persisted) cleanup(); else finish(); }, { signal });
}
