// The visitor's motion setting, "on" or "off". It comes from their choice in
// the footer (kept in localStorage) or, until they choose, from their
// prefers-reduced-motion setting. The inline script in Base.astro applies the
// same rule before the first paint and writes it to <html data-motion>, which
// the CSS reads; this module reads and changes it afterwards.

export type Motion = "on" | "off";

const STORAGE_KEY = "luisdataworks:motion"; // also read by Base.astro
const root = document.documentElement;
const system = window.matchMedia("(prefers-reduced-motion: no-preference)");

export function storedChoice(): Motion | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "on" || value === "off" ? value : null;
  } catch {
    return null;
  }
}

export function currentMotion(): Motion {
  return root.dataset.motion === "on" ? "on" : "off";
}

export function motionAllowed(): boolean {
  return currentMotion() === "on";
}

function apply(next: Motion) {
  if (currentMotion() === next) return;
  root.dataset.motion = next;
  document.dispatchEvent(new CustomEvent<Motion>("motionchange", { detail: next }));
}

// An explicit choice, kept between visits.
export function chooseMotion(value: Motion) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage blocked: the choice still applies to this page.
  }
  apply(value);
}

export function onMotionChange(callback: (motion: Motion) => void) {
  document.addEventListener("motionchange", (event) => callback((event as CustomEvent<Motion>).detail));
}

// Until the visitor chooses, a change of the system setting applies at once.
system.addEventListener("change", () => {
  if (!storedChoice()) apply(system.matches ? "on" : "off");
});
