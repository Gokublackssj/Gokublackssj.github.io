// Section entrances, the footer's motion control and the screen recording.
// The entrances are run by the GSAP module (motion.ts), fetched once the page
// is idle after its first paint. The CSS only hides [data-reveal] elements
// while <html> has the "js" class and data-motion="on"; with motion reduced,
// data saver on (unless the visitor chose motion), or a module that fails or
// takes too long to load, everything is shown at once.

import { initMotionControl } from "./motion-control";
import { motionAllowed, onMotionChange, storedChoice } from "./motion-preference";

declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

const root = document.documentElement;
const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

const showAll = () => document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));

// The module is fetched at most once, whatever the visitor switches.
let motionModule: Promise<typeof import("./motion")> | null = null;

function enable(firstLoad: boolean) {
  if (!firstLoad) {
    // Switched on mid-page: what is still below the viewport waits again, so
    // it can enter; what is already in view stays as it is.
    document.querySelectorAll<HTMLElement>("[data-reveal].is-in").forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) el.classList.remove("is-in");
    });
  }
  const fallback = window.setTimeout(showAll, 4000);
  const load = () => {
    motionModule ??= import("./motion");
    motionModule
      .then((m) => {
        window.clearTimeout(fallback);
        if (motionAllowed()) m.start();
      })
      .catch(() => {
        window.clearTimeout(fallback);
        motionModule = null;
        showAll();
      });
  };
  if (!firstLoad) load();
  else if ("requestIdleCallback" in window) window.requestIdleCallback(load, { timeout: 1500 });
  else setTimeout(load, 200);
}

function disable() {
  showAll();
  motionModule?.then((m) => m.stop()).catch(() => {});
}

if (motionAllowed() && !(saveData && !storedChoice())) enable(true);
else showAll();

onMotionChange((motion) => (motion === "on" ? enable(false) : disable()));
initMotionControl();

// Screen recordings play only on request: a play button over the poster, then
// the native controls. A video scrolled out of view pauses.
const videoObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) (entry.target as HTMLVideoElement).pause();
          }
        },
        { threshold: 0.2 },
      )
    : null;

document.querySelectorAll<HTMLVideoElement>("video[data-demo]").forEach((video) => {
  const play = video.parentElement?.querySelector<HTMLButtonElement>("[data-video-play]");
  if (!play) return;
  video.controls = false;
  play.hidden = false;
  play.addEventListener("click", () => {
    video.controls = true;
    if (video.ended) video.currentTime = 0;
    video.play().catch(() => {});
    video.focus();
  });
  video.addEventListener("play", () => (play.hidden = true));
  video.addEventListener("ended", () => {
    const hadFocus = document.activeElement === video;
    video.controls = false;
    play.hidden = false;
    if (hadFocus) play.focus();
  });
  videoObserver?.observe(video);
});

window.__revealReady = true;
root.classList.add("js");

export {};
