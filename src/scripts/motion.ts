// Scroll motion with GSAP and ScrollTrigger, loaded by reveal.ts after the
// first paint. While an element enters, GSAP owns its opacity and transform;
// CSS owns hover, press and the hero entrance. When an animation ends, the
// inline styles are cleared and the .is-in class keeps the element visible.
//
// start() and stop() follow the visitor's motion setting (motion-preference.ts).
// Everything is created inside one gsap.matchMedia(), so stop() removes every
// tween and ScrollTrigger at once, and start() never runs twice.

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// GSAP's expo.out is cubic-bezier(0.16, 1, 0.3, 1), the --ease-out token.
const EASE = "expo.out";

function settle(elements: Element[]) {
  if (!elements.length) return;
  elements.forEach((el) => el.classList.add("is-in"));
  gsap.set(elements, { clearProps: "opacity,visibility,transform,clipPath" });
}

let mm: gsap.MatchMedia | null = null;
let fontsRefresh = false;

export function start() {
  if (mm) return;
  mm = gsap.matchMedia();

  // One of phone and wide always matches; a resize across either breakpoint
  // rebuilds.
  mm.add({ phone: "(max-width: 760px)", wide: "(min-width: 761px)" }, (context) => {
    const { phone } = context.conditions!;
    const waiting = gsap.utils.toArray<HTMLElement>("[data-reveal]:not(.is-in)");

    // Anything already scrolled past (a reload mid-page, a jump to an anchor)
    // is shown at once instead of animating out of sight.
    const past = waiting.filter((el) => el.getBoundingClientRect().bottom < 0);
    settle(past);
    const pending = waiting.filter((el) => !past.includes(el));

    // Elements given their own move below are left out of the shared batch.
    const handled = new Set<HTMLElement>();
    const mine = (el: HTMLElement | null): el is HTMLElement => !!el && pending.includes(el) && !handled.has(el);

    // Each case study opens as one sequence: its name, what it is and its
    // status rise in reading order.
    gsap.utils.toArray<HTMLElement>(".case").forEach((article) => {
      const words = [".case-head h4", ".case-head .case-kind", ".case-head .case-useful", ".case-head .case-status"]
        .map((s) => article.querySelector<HTMLElement>(s))
        .filter(mine);
      if (!words.length) return;
      words.forEach((el) => handled.add(el));
      gsap.fromTo(
        words,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          ease: EASE,
          duration: phone ? 0.5 : 0.65,
          stagger: 0.08,
          scrollTrigger: { trigger: article, start: "top 85%", once: true },
          onComplete: () => settle(words),
        },
      );
    });

    // A main screenshot (a case's, or a website's) surfaces from its bottom
    // edge up when it arrives.
    gsap.utils.toArray<HTMLElement>(".case-lead-shot, .site-shot").filter(mine).forEach((shot) => {
      handled.add(shot);
      gsap.fromTo(
        shot,
        { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: EASE,
          duration: phone ? 0.8 : 1.05,
          scrollTrigger: { trigger: shot, start: "top 88%", once: true },
          onComplete: () => settle([shot]),
        },
      );
    });

    // Secondary screenshots open one after another: the first, then the
    // second, then the third, each from its own mask, so the row reads in
    // order instead of landing at once. Every one is readable within about a
    // second of the row arriving.
    gsap.utils.toArray<HTMLElement>(".shot-grid, .phone-strip").forEach((list) => {
      const items = gsap.utils.toArray<HTMLElement>(":scope > li", list).filter(mine);
      if (!items.length) return;
      items.forEach((el) => handled.add(el));
      gsap.fromTo(
        items,
        { autoAlpha: 1, y: 28, clipPath: "inset(100% 0% 0% 0%)" },
        {
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          ease: EASE,
          duration: phone ? 0.7 : 0.9,
          stagger: phone ? 0.1 : 0.14,
          scrollTrigger: { trigger: list, start: "top 85%", once: true },
          onComplete: () => settle(items),
        },
      );
    });

    // Everything else: elements that reach the viewport together rise in turn.
    ScrollTrigger.batch(
      pending.filter((el) => !handled.has(el)),
      {
        start: "top 92%",
        once: true,
        batchMax: phone ? 3 : 6,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              duration: phone ? 0.45 : 0.55,
              ease: EASE,
              stagger: 0.06,
              overwrite: true,
              onComplete: () => settle(batch),
            },
          );
        },
      },
    );

    // Lead screenshots drift a little inside their frame while they cross
    // the viewport. The wrapper moves, so the image keeps its own hover zoom.
    if (!phone) {
      gsap.utils.toArray<HTMLElement>(".case-lead-shot .shot picture").forEach((picture) => {
        gsap.fromTo(
          picture,
          { yPercent: -1.5, scale: 1.06 },
          {
            yPercent: 1.5,
            scale: 1.06,
            ease: "none",
            scrollTrigger: { trigger: picture.closest("figure"), start: "top bottom", end: "bottom top", scrub: 0.3 },
          },
        );
      });
    }

    // On a resize across the breakpoint, nothing may be left hidden.
    return () => settle(gsap.utils.toArray("[data-reveal]"));
  });

  // Web fonts change line heights, and with them every trigger position.
  if (!fontsRefresh) {
    fontsRefresh = true;
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }
}

// Reduced motion chosen: remove every tween and ScrollTrigger, then make
// sure no inline style is left and every element is shown.
export function stop() {
  if (!mm) return;
  mm.revert();
  mm = null;
  settle(gsap.utils.toArray("[data-reveal]"));
  gsap.set(".case-lead-shot .shot picture", { clearProps: "transform,transformOrigin" });
}
