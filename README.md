# luisdataworks — Portfolio of Luis Alvaro Pimentel Tacuri

Bilingual portfolio (English by default at `/`, Spanish at `/es/`) presenting
QuoteFlow, LeadFlow and Book Data Extractor Pro, the tools they use, freelance
services and contact details. Live at https://gokublackssj.github.io/.

- Astro 7, static output, TypeScript for data and scripts
- About 4 KB (brotli) of page JavaScript up front (screenshot viewer, phone menu, video play button, motion
  setting); GSAP + ScrollTrigger (about 40 KB brotli) load afterwards, only while animations are on (see Motion)
- Fonts self-hosted through Fontsource: Big Shoulders 800 (display) and Public Sans (text)
- Screenshots served as AVIF/WebP in several widths; full-size WebP in the viewer
- No trackers, cookies, analytics or third-party requests. `localStorage` keeps one value: the visitor's
  animations choice, if they make one

## Commands

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # astro check + static build into dist/
npm run preview   # serve dist/
```

## Structure

```text
src/
  pages/              index.astro (en), es/index.astro, 404.astro, sitemap.xml.ts
  components/         Page, Header, Hero, CaseStudy, Gallery, Lightbox, ZoomBadge
  layouts/Base.astro  <head>: SEO, hreflang, Open Graph, JSON-LD, fonts
  i18n/               en.ts (source of truth for structure), es.ts, index.ts
  data/               shots.ts (screenshot list), links.ts (email, GitHub, CV, repos)
  scripts/            reveal.ts (loads motion.ts, video), motion.ts (GSAP), lightbox.ts,
                      motion-preference.ts (the animations setting), motion-control.ts (footer control)
  styles/global.css   tokens and all styles
  assets/shots/       original PNG screenshots (optimized at build time)
public/
  cv/                 Luis_Pimentel_CV.pdf / .docx (English), Luis_Pimentel_CV_ES.pdf (Spanish, linked from /es/)
  media/              leadflow-flow.mp4 / .webm (13 s screen recording, plays only on request)
  favicon.svg, robots.txt, .nojekyll
docs/screenshots/     captures of this site at 1440, 768 and 390 px (en and es); the full-page *-full.jpg
                      captures are git-ignored and kept on the local machine only
_legacy-static/       local only (git-ignored, not in the repository): previous HTML/CSS version,
                      original CV files and CV backups
```

Every visible string lives in `src/i18n/en.ts` and `src/i18n/es.ts`. The
Spanish file is typed against the English one, so a missing key fails the build.

## Motion

CSS and GSAP each own their own properties, so the two never animate the same thing.

| Animation | Tool | Purpose | Ingredients |
|---|---|---|---|
| Hero entrance: headline lines rise from behind the waterline, then sentence, availability and buttons | CSS keyframes (runs on first paint) | Arrival | 700 ms lines (80 ms apart), 500 ms rest from 250 ms, `--ease-out`. The sentence (the LCP element) only rises and is never transparent, so it counts as painted on the first frame |
| Hover and press on buttons, links, contact rows, CV links, thumbnails | CSS transitions | Feedback | 160 ms press to `scale(0.97)`; hover movement only with `(hover: hover) and (pointer: fine)` |
| Section entrances | GSAP `ScrollTrigger.batch` | Prevent content popping in | `autoAlpha` + 16 px, 0.55 s (0.45 s phones), 60 ms stagger, once |
| Case study head: name, kind, facts, then the lead screenshot surfacing from below | GSAP timeline + ScrollTrigger | Explain hierarchy | 0.65 s words, 0.9 s `clip-path` reveal, once |
| Hero waterline: the silver field rises and the headline lags as the hero leaves | GSAP ScrollTrigger `scrub: 0.6` | Spatial continuity | `scaleY` on the field, `y` on the heading (never a wrapper: a transformed wrapper breaks the `mix-blend-mode` contrast) |
| Lead screenshot drift (desktop) | GSAP ScrollTrigger `scrub: 0.3` | Depth | ±1.5 % on the `<picture>` wrapper, so the `<img>` keeps its hover zoom |
| Viewer: screenshot travels from its thumbnail and back; next/previous slide | GSAP (FLIP), one `gsap.context()` per viewing | Spatial continuity | 0.4 s open, 0.3 s close, 0.28 s slide; CSS fade is the fallback |

`expo.out` in GSAP is the same curve as `--ease-out`.

**The visitor's setting.** The footer has an "Animations" control (On / Reduced; "Animaciones":
Activadas / Reducidas). Until the visitor chooses, the site follows `prefers-reduced-motion`, also when it
changes while the page is open. A choice is kept in `localStorage` (`luisdataworks:motion`) and wins over
the system setting on later visits. The note under the control says which one applies.

- An inline script in `Base.astro` sets `<html data-motion="on|off">` before the first paint. All motion CSS
  hangs on that attribute through `:where([data-motion="on"])`, so selector specificity is unchanged.
  Without JavaScript there is no attribute: nothing moves, nothing is hidden, and the control stays hidden.
- `motion-preference.ts` reads and changes the setting and fires a `motionchange` event.
- Switching to Reduced calls `stop()` in `motion.ts`: one `gsap.matchMedia().revert()` removes every tween
  and ScrollTrigger, inline styles are cleared and every element is shown. Switching to On calls `start()`,
  which never runs twice; what is still below the viewport waits again so it can enter. GSAP is fetched at
  most once per page, whatever the visitor switches.
- The viewer reads the setting on every opening.

**Loading.** `reveal.ts` imports `motion.ts` (GSAP + ScrollTrigger) once the page is idle, only while
animations are on (and not on data saver unless the visitor chose On). If the module fails, everything is
shown at once; if it takes over 4 s, the same.

**Not done on purpose.** No pinning, no smooth-scroll hijacking, no animated counters on the test figures,
no footer animation (it would compete with the footer's call to action).

## Content sources (checked on 2026-10-24)

Do not add clients, testimonials, metrics, proficiency levels or features that
cannot be checked in the repositories.

| Claim | Source |
|---|---|
| QuoteFlow features, decisions, limitations | `README.md`, `docs/imports.md`, `docs/decisions.md`, `infra/n8n/README.md` in github.com/Gokublackssj/quoteflow |
| QuoteFlow: 512 backend tests | `pytest --collect-only` on the local clone |
| QuoteFlow: 46 frontend tests | count of `test(` in `frontend/tests/*.mjs` (matches the README) |
| LeadFlow features, decisions, limitations | `README.md` in github.com/Gokublackssj/LeadFlow |
| LeadFlow: 148 backend tests | `pytest --collect-only` on the local clone |
| LeadFlow: 17 end-to-end tests | count of `test(` in `frontend/e2e/*.spec.ts` |
| Book Data Extractor Pro | previous portfolio text, verified against the repository on 2026-10-24 |
| Personal details | the CV |

If a project changes, update the numbers and the text in both language files.

## Screenshots

- **QuoteFlow:** copied from `docs/screenshots/` of the QuoteFlow repository (fictitious data). The repository was not modified.
- **LeadFlow:** the repository has no screenshots, so they were generated for this site from a **copy** of the
  LeadFlow frontend (production build) with the API simulated in the browser, the same technique as the
  project's own Playwright tests (`e2e/api-simulada.ts`). No backend or database was used, and the LeadFlow
  repository was not modified. All data is fictitious. The same method produced the screen recording in `public/media/`.

To add a screenshot: put the PNG in `src/assets/shots/<project>/`, import it in `src/data/shots.ts` and add its
caption and alt text under the same id in both language files.

## CV

One page, in the original design (Calibri, same margins, colours, headings and bullets). The content was
updated on 2026-10-25: QuoteFlow, LeadFlow and Book Data Extractor Pro, each described from its repository,
and a conservative skills split (Core tools: Python, Playwright, openpyxl, pytest; the rest under "Also used in
projects").

- English (main): `public/cv/Luis_Pimentel_CV.docx` is the editable source; the PDF is exported from it with Word.
  Both are linked from `/` and `/es/`.
- Spanish: the published file is `public/cv/Luis_Pimentel_CV_ES.pdf`, linked from `/es/` only. Its editable
  source, `docs/cv/Luis_Pimentel_CV_ES.docx`, and the side-by-side comparisons with the previous version
  (`docs/cv/comparison-*.png`) are git-ignored and kept on the local machine only.
- Backups, local only (git-ignored, not in the repository): `_legacy-static/cv-original/` (the very first files,
  with an old email typo) and `_legacy-static/cv-backup-2026-10-25/` (the version before this update).
- Not in the CV: phone and Upwork (the website links the confirmed Upwork profile), and the portfolio URL (until
  the site is published).

## Checks run before handing over

- `astro check`: 0 errors. Static build: 3 pages, no console errors.
- Design inspector (tasteskill) at 1440, 768 and 390 px, both languages: 0 FAIL.
- axe-core (WCAG 2.0/2.1/2.2 A and AA plus best practices) at 1440 and 390 px, `/`, `/es/` and 404: 0 violations.
- Lighthouse, mobile and desktop, both languages: 100 in performance, accessibility, best practices and SEO.
- No horizontal scroll from 320 to 1920 px. All local links and images return 200, every in-page anchor exists.
- The screenshot viewer works from the keyboard (Enter, arrows, Tab kept inside, Escape, focus returns), keeps the image within 85vw x 80vh with its
  title and description below it, and locks page scrolling while open. The phone menu works without JavaScript.
- `prefers-reduced-motion: reduce` (or "Reduced" in the footer): GSAP not downloaded, nothing left hidden, only short fades. The video never autoplays: it starts from a play button.
- Motion (2026-10-25): 37 checks on lazy loading and fallbacks (GSAP blocked, GSAP 7 s late, no JS, reduced motion,
  anchors, reload mid-page, resize), 30 on the viewer (from/to thumbnail, interruptions, rapid arrows), 8 on
  hover gating, a pixel test of the blended hero heading at several scroll positions, and 81 checks in
  Chromium, Firefox and WebKit. axe skips only the hero heading, whose `mix-blend-mode` it cannot compute.
- Animations control (2026-10-25): 34 checks: system default both ways, live switching both ways, six rapid
  switches (GSAP fetched once), choice kept after reload in both directions, GSAP blocked, keyboard (Enter,
  Space, visible focus ring), group name and description, axe on the footer, no JavaScript, Spanish labels,
  and a live change of the system setting.
- Lighthouse (median of 3): 100 on desktop; mobile 99–100 (performance), 100 in the other three; CLS 0.
  The web fonts used on the first screen are preloaded (without them the simulated mobile LCP is about
  0.2 s worse and the layout shifts when they arrive).

## Upwork policy note

The contact section links the Upwork profile (URL taken from the previous portfolio's README).

The page shows an email address and links the CV. Upwork's terms prohibit sharing outside contact details
before a contract exists. Do not link this site or the CV from an Upwork profile, proposal or message before
a contract is in place. The contact section keeps a note asking Upwork clients to stay in Upwork Messages.

## QuoteFlow demo video (not made)

QuoteFlow's pages fetch their data on the server from the FastAPI backend, which needs PostgreSQL, so a recording
cannot use a browser-side mock as LeadFlow's did. Recording it means running the backend against a database; do it
only with a disposable database, in a copy of the repository.

## Publish with GitHub Pages

Live at `https://gokublackssj.github.io/`, from the public repository `Gokublackssj.github.io`. Everything in
the repository is public; `.gitignore` keeps the local-only material out (see above).

`.github/workflows/deploy.yml` builds and deploys on every push to `main` (Settings → Pages → Source: GitHub
Actions). It needs no secrets, pins every action to a commit SHA, and gives write access to Pages only to the
deploy job. After a deploy, check both languages, the CV links, the video and the layout on a phone.

If the address changes (custom domain or a project repository), update `site` in `astro.config.mjs` and the
`Sitemap:` line in `public/robots.txt`.
