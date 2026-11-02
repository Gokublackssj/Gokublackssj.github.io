// Demo previews: a real screenshot of each published concept demo, desktop
// and mobile, or a short muted recording with that screenshot as its poster.
//
// - The Desktop / Mobile buttons switch between the two views.
// With a recording:
// - A preview plays only while it is on screen (at least 40 % visible) and
//   motion is on; it pauses when it leaves the screen, when the tab is hidden
//   and when motion is turned off.
// - With motion reduced, nothing plays by itself: the screenshot (the poster)
//   shows, and the play button starts the preview on request.
// - Nothing depends on hover. Without this script, each video keeps the
//   browser's own controls and plays only when asked.

import { motionAllowed, onMotionChange } from "./motion-preference";

type Preview = {
  root: HTMLElement;
  /** The desktop and mobile views: screenshots or recordings. */
  views: Map<string, HTMLElement>;
  /** Only when the views are recordings. */
  play: HTMLButtonElement | null;
  view: string;
  visible: boolean;
  /** The visitor paused it, or never started it with motion reduced. */
  held: boolean;
};

const current = (p: Preview) => p.views.get(p.view)!;
const videoOf = (p: Preview) => {
  const view = current(p);
  return view instanceof HTMLVideoElement ? view : null;
};

function render(p: Preview) {
  const video = videoOf(p);
  if (!p.play || !video) return;
  const playing = !video.paused;
  p.play.textContent = (playing ? p.play.dataset.labelPause : p.play.dataset.labelPlay) ?? "";
  p.play.setAttribute("aria-pressed", String(playing));
}

function update(p: Preview) {
  const video = videoOf(p);
  if (!video) return;
  const shouldPlay = p.visible && !p.held && document.visibilityState === "visible";
  if (shouldPlay && video.paused) video.play().catch(() => {});
  if (!shouldPlay && !video.paused) video.pause();
}

export function initDemoPreviews() {
  const roots = document.querySelectorAll<HTMLElement>("[data-demo-preview]");
  if (!roots.length) return;
  const previews: Preview[] = [];

  roots.forEach((root) => {
    const views = new Map<string, HTMLElement>();
    root.querySelectorAll<HTMLElement>(".demo-frame [data-view]").forEach((v) => {
      // The script takes over: no native controls, one shared play button.
      if (v instanceof HTMLVideoElement) v.controls = false;
      views.set(v.dataset.view!, v);
    });
    const controls = root.querySelector<HTMLElement>("[data-demo-controls]")!;
    const play = root.querySelector<HTMLButtonElement>("[data-demo-play]");
    const p: Preview = { root, views, play, view: root.dataset.view ?? "desktop", visible: false, held: !motionAllowed() };
    previews.push(p);
    controls.hidden = false;
    views.forEach((v) => {
      v.addEventListener("play", () => render(p));
      v.addEventListener("pause", () => render(p));
    });

    play?.addEventListener("click", () => {
      const video = videoOf(p);
      if (!video) return;
      if (video.paused) {
        p.held = false;
        video.play().catch(() => {});
      } else {
        p.held = true;
        video.pause();
      }
    });

    root.querySelectorAll<HTMLButtonElement>("[data-demo-view]").forEach((button) =>
      button.addEventListener("click", () => {
        const next = button.dataset.demoView!;
        if (next === p.view) return;
        const was = videoOf(p);
        const wasPlaying = !!was && !was.paused;
        was?.pause();
        current(p).hidden = true;
        p.view = next;
        root.dataset.view = next;
        current(p).hidden = false;
        root.querySelectorAll("[data-demo-view]").forEach((b) => b.setAttribute("aria-pressed", String((b as HTMLElement).dataset.demoView === next)));
        if (wasPlaying) videoOf(p)?.play().catch(() => {});
        render(p);
      }),
    );
    render(p);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const p = previews.find((x) => x.root === entry.target);
          if (!p) continue;
          p.visible = entry.isIntersecting;
          update(p);
        }
      },
      { threshold: 0.4 },
    );
    previews.forEach((p) => observer.observe(p.root));
  }

  document.addEventListener("visibilitychange", () => previews.forEach(update));
  onMotionChange((motion) => {
    previews.forEach((p) => {
      // Reduced: stop and wait for a click. On: play again where visible.
      p.held = motion === "off";
      update(p);
    });
  });
}
