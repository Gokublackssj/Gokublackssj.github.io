// The visitor's motion setting, "on" or "off". It comes from their choice in
// the footer (kept in localStorage) or, until they choose, or after they go
// back to "Device", from their prefers-reduced-motion setting. The inline
// script in Base.astro applies the same rule before the first paint and writes
// it to <html data-motion>, which the CSS reads; this module reads and changes
// it afterwards.
//
// The device setting and the visitor's choice are kept apart: storedChoice()
// is only ever an explicit choice, so "Reduced" pressed on a device that
// already reduces motion is still a choice, and "Device" removes it.

export type Motion = "on" | "off";
export type MotionChoice = Motion | "system";

const STORAGE_KEY = "luisdataworks:motion"; // also read by Base.astro
const root = document.documentElement;
const system = window.matchMedia("(prefers-reduced-motion: no-preference)");
// Holds the choice for this page when storage is blocked.
let pageChoice: Motion | null = null;

export function storedChoice(): Motion | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "on" || value === "off") return value;
  } catch {
    // Storage blocked: fall back to this page's choice.
  }
  return pageChoice;
}

export function systemMotion(): Motion {
  return system.matches ? "on" : "off";
}

export function currentMotion(): Motion {
  return root.dataset.motion === "on" ? "on" : "off";
}

export function motionAllowed(): boolean {
  return currentMotion() === "on";
}

function apply(next: Motion) {
  // The hero's first-paint entrance (html.intro, see Base.astro) belongs to
  // the first load only: once the setting changes, it never plays again.
  root.classList.remove("intro");
  if (currentMotion() === next) return;
  root.dataset.motion = next;
  document.dispatchEvent(new CustomEvent<Motion>("motionchange", { detail: next }));
}

// "Device" forgets the visitor's choice and follows the system again; "on" and
// "off" are explicit choices, kept between visits.
export function chooseMotion(value: MotionChoice) {
  pageChoice = value === "system" ? null : value;
  try {
    if (value === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage blocked: the choice still applies to this page.
  }
  apply(value === "system" ? systemMotion() : value);
  // The control redraws even when the effective setting did not change (for
  // example "Device" on a device whose setting matches the old choice).
  document.dispatchEvent(new CustomEvent<Motion>("motionsettingchange", { detail: currentMotion() }));
}

export function onMotionChange(callback: (motion: Motion) => void) {
  document.addEventListener("motionchange", (event) => callback((event as CustomEvent<Motion>).detail));
}

export function onMotionSettingChange(callback: () => void) {
  document.addEventListener("motionsettingchange", callback);
  document.addEventListener("motionchange", callback);
}

// Until the visitor chooses, a change of the system setting applies at once.
system.addEventListener("change", () => {
  if (!storedChoice()) apply(systemMotion());
});
