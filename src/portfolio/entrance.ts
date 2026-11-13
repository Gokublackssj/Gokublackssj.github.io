// Shared editorial portfolio entrances. Light on purpose:
// an IntersectionObserver adds .is-in and CSS does a short fade/lift (see
// html.pf-reveal in portfolio.css). No library, nothing infinite.
//
// Same contract as the site's reveal.ts: content is hidden only while <html>
// has the class set by the inline script, which happens only when the site's
// motion setting is "on"; a timer there removes it if this module never runs.

import { motionAllowed } from "../scripts/motion-preference";

import { createLabScope } from "./lifecycle";
let scope: ReturnType<typeof createLabScope> | undefined;

declare global {
  interface Window {
    __pfRevealReady?: boolean;
  }
}

export function initEntrances() {
  scope?.dispose();
  const owned = createLabScope(); scope = owned;
  const root = document.documentElement;
  const items = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
  const showAll = () => {
    root.classList.remove("pf-reveal");
    items.forEach((el) => el.classList.add("is-in"));
  };
  owned.onDispose(() => { showAll(); window.__pfRevealReady = false; });
  window.__pfRevealReady = true;
  if (!root.classList.contains("pf-reveal") || !motionAllowed() || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
  );
  owned.observe(observer);
  items.forEach((el) => observer.observe(el));
  // Turning motion off mid-page shows everything at once.
  owned.listen(document, "motionchange", (event) => {
    if ((event as CustomEvent<string>).detail === "off") {
      observer.disconnect();
      showAll();
    }
  });
  // Printing or an anchor jump past a section never leaves it invisible.
  owned.listen(window, "beforeprint", showAll);
}

export function disposeEntrances() { scope?.dispose(); }
