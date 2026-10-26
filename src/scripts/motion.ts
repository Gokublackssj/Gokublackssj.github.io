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

  // One of the two always matches; a resize across the breakpoint rebuilds.
  mm.add({ phone: "(max-width: 760px)", wide: "(min-width: 761px)" }, (context) => {
    const { phone } = context.conditions!;
    const waiting = gsap.utils.toArray<HTMLElement>("[data-reveal]:not(.is-in)");

    // Anything already scrolled past (a reload mid-page, a jump to an anchor)
    // is shown at once instead of animating out of sight.
    const past = waiting.filter((el) => el.getBoundingClientRect().bottom < 0);
    settle(past);
    const pending = waiting.filter((el) => !past.includes(el));

    // Each case study opens as one sequence: name, kind and facts rise in
    // order, then the lead screenshot surfaces from the bottom edge up, the
    // way the hero's waterline moves.
    const inCaseHeads = new Set<HTMLElement>();
    gsap.utils.toArray<HTMLElement>(".case").forEach((article) => {
      const words = [".case-title h3", ".case-title .lead", ".case-meta"]
        .map((s) => article.querySelector<HTMLElement>(s))
        .filter((el): el is HTMLElement => !!el && pending.includes(el));
      const shot = article.querySelector<HTMLElement>(".case-lead-shot");
      const parts = shot && pending.includes(shot) ? [...words, shot] : words;
      if (!parts.length) return;
      parts.forEach((el) => inCaseHeads.add(el));
      const timeline = gsap.timeline({
        defaults: { ease: EASE },
        scrollTrigger: { trigger: article, start: "top 85%", once: true },
        onComplete: () => settle(parts),
      });
      if (words.length) {
        timeline.fromTo(words, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: phone ? 0.5 : 0.65, stagger: 0.08 });
      }
      if (parts.includes(shot!)) {
        timeline.fromTo(
          shot,
          { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: phone ? 0.7 : 0.9, clearProps: "clipPath" },
          words.length ? "-=0.35" : 0,
        );
      }
    });

    // Everything else: elements that reach the viewport together rise in turn.
    ScrollTrigger.batch(
      pending.filter((el) => !inCaseHeads.has(el)),
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

    // The waterline rises as the hero leaves: the silver field grows up from
    // its seam while the headline falls behind the scroll, so the words sink
    // from silver-on-graphite into graphite-on-silver.
    // The heading itself moves, never a wrapper: a transformed wrapper would
    // start a stacking context and cut the heading off from the field it
    // blends with (difference), losing its contrast on the silver.
    const hero = document.querySelector<HTMLElement>(".hero");
    const field = hero?.querySelector<HTMLElement>(".hero-field");
    const title = hero?.querySelector<HTMLElement>(".hero-title");
    if (hero && field && title) {
      const seamTo = phone ? 0.3 : 0.15;
      gsap
        .timeline({
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
        })
        .to(field, { scaleY: () => (1 - seamTo) / (1 - field.offsetTop / hero.offsetHeight), transformOrigin: "50% 100%", ease: "none" }, 0)
        // xPercent keeps the CSS centring (translateX(-50%)).
        .fromTo(title, { xPercent: -50, x: 0, y: 0 }, { xPercent: -50, x: 0, y: () => hero.offsetHeight * (phone ? 0.12 : 0.2), ease: "none" }, 0);
    }

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
  gsap.set([".hero-field", ".hero-title", ".case-lead-shot .shot picture"], { clearProps: "transform,transformOrigin" });
}
