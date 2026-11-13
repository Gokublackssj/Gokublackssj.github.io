// The header's theme switch. The inline script in Base.astro has already set
// <html data-theme="light|dark"> before the first paint, from the visitor's
// stored choice or their prefers-color-scheme; this module only changes it.
//
// A choice is kept in localStorage (key shared with Base.astro) and wins over
// the system setting on later visits and on the other language's page. Until
// the visitor chooses, the page follows the system, also when it changes while
// the page is open. Without JavaScript the switch stays hidden and the CSS
// follows prefers-color-scheme on its own.

import { motionAllowed } from "./motion-preference";

type Theme = "light" | "dark";

const KEY = "luisdataworks:theme";
const root = document.documentElement;
const system = window.matchMedia("(prefers-color-scheme: dark)");
// The same values as --canvas in global.css, for the browser's own chrome.
const CHROME: Record<Theme, string> = { light: "#ffffff", dark: "#16181b" };

const current = (): Theme => (root.dataset.theme === "dark" ? "dark" : "light");

function stored(): Theme | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function setChrome(theme: Theme, chosen: boolean) {
  const chrome = root.hasAttribute("data-portfolio") ? {light:"#f5faf8",dark:"#071014"} : CHROME;
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta, i) => {
    if (chosen) {
      meta.content = chrome[theme];
      meta.removeAttribute("media");
    } else {
      // Back to one value per system scheme, as Base.astro writes them.
      const scheme: Theme = i === 0 ? "light" : "dark";
      meta.content = chrome[scheme];
      meta.media = `(prefers-color-scheme: ${scheme})`;
    }
  });
}

function apply(theme: Theme, chosen: boolean, button: HTMLButtonElement, animate = true) {
  const change = () => {
    root.dataset.theme = theme;
    button.setAttribute("aria-pressed", String(theme === "dark"));
    setChrome(theme, chosen);
  };
  // A short crossfade of the whole page where the browser supports it and
  // motion is on; otherwise the switch is instant.
  if (animate && motionAllowed() && "startViewTransition" in document) {
    root.classList.add("theme-switching");
    const transition = document.startViewTransition(change);
    transition.finished.catch(() => {}).finally(() => root.classList.remove("theme-switching"));
  } else {
    change();
  }
}

export function initThemeToggle(selector = "[data-theme-toggle]", animate = true) {
  const button = document.querySelector<HTMLButtonElement>(selector);
  if (!button || button.dataset.themeReady) return;
  button.dataset.themeReady = "true";
  const controller = new AbortController();
  const { signal } = controller;
  button.hidden = false;
  button.setAttribute("aria-pressed", String(current() === "dark"));
  const toggle = () => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    try { localStorage.setItem(KEY, next); } catch {}
    apply(next, true, button, animate);
  };
  button.addEventListener("click", toggle, { signal });
  // The circular reveal invokes the same handler after taking its snapshot.
  button.addEventListener("lab:theme-toggle", toggle, { signal });
  system.addEventListener("change", event => { if (!stored()) apply(event.matches ? "dark" : "light", false, button, animate); }, { signal });
  const cleanup = () => { controller.abort(); delete button.dataset.themeReady; };
  document.addEventListener("astro:before-swap", cleanup, { once:true, signal });
  window.addEventListener("pagehide", event => { if (!event.persisted) cleanup(); }, { signal });
}
