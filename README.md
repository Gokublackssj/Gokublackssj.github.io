# luisdataworks — Portfolio of Luis Alvaro Pimentel Tacuri

Bilingual portfolio (English by default at `/`, Spanish at `/es/`) presenting
QuoteFlow, LeadFlow and Book Data Extractor Pro, the tools they use, freelance
services, junior-role availability and contact details. Public site: https://gokublackssj.github.io/.

- Astro 7, static output, TypeScript for data and scripts
- Page JavaScript handles the screenshot viewer, phone menu, video, contact composer and preferences.
  GSAP + ScrollTrigger load afterwards, only while animations are on (see Motion).
- Fonts self-hosted through Fontsource: Source Serif 4 variable (upright and italic display) and Public Sans
  variable (text and interface); the Latin files are preloaded
- Screenshots served as AVIF/WebP in several widths; full-size WebP in the viewer
- No trackers, cookies, analytics or third-party requests. `localStorage` keeps the visitor's
  animation and theme choices, if they make them

## Commands

```bash
npm ci            # use the existing lockfile
npm run dev       # http://localhost:4321
npm run build     # astro check + static build into dist/
npm run preview   # serve dist/
```

## Structure

```text
src/
  pages/              index.astro (en), es/index.astro, 404.astro, sitemap.xml.ts
  components/         Page (the order of the sections, and the projects in two categories:
                      Python, data & automation first, then Web development), Header, Hero (headline and actions),
                      WebProjects (websites and the package demos), WebsiteCard, DemoCard, CaseStudy,
                      RunSteps, Gallery, Lightbox, ZoomBadge, Services (deliverables, evidence links,
                      website packages and service-specific contact actions),
                      Process (how we work), About, Faq, Contact, Footer
  layouts/Base.astro  <head>: SEO, hreflang, Open Graph, JSON-LD, fonts, and the inline script that sets the
                      theme and the motion setting before the first paint
  i18n/               en.ts (source of truth for structure), es.ts, index.ts
  data/               shots.ts (screenshots), projects.ts (finished websites, and the list of Python
                      case studies the category count comes from),
                      demos.ts (concept demos of the website packages: "planned" ones are listed as in progress,
                      "published" ones get a card with a video preview, a screenshot poster and their link),
                      commands.ts (how each project is run and tested, as its README gives it),
                      links.ts (email, GitHub, CV, repos)
  scripts/            reveal.ts (loads motion.ts, video), motion.ts (GSAP), lightbox.ts, theme.ts (theme switch),
                      contact.ts (the form that prepares an email), demo-preview.ts (plays a demo preview only
                      on screen and with motion on; Desktop / Mobile switch), motion-preference.ts (the animations
                      setting), motion-control.ts (footer control)
  styles/global.css   tokens (light and dark) and all styles
  assets/shots/       original PNG screenshots (optimized at build time); site/ holds this site's own screenshots
                      for the Websites card, retaken whenever the first screen changes
public/
  cv/                 Luis_Pimentel_CV.pdf / .docx (English), Luis_Pimentel_CV_ES.pdf (Spanish, linked from /es/)
  media/              leadflow-flow.mp4 / .webm (13 s screen recording, plays only on request)
  favicon.svg, robots.txt, .nojekyll
docs/screenshots/     captures of the previous design at 1440, 768 and 390 px (en and es); the full-page
                      *-full.jpg captures are git-ignored and kept on the local machine only
_legacy-static/       local only (git-ignored, not in the repository): previous HTML/CSS version,
                      original CV files and CV backups
```

Every visible string lives in `src/i18n/en.ts` and `src/i18n/es.ts`. The
Spanish file is typed against the English one, so a missing key fails the build.

**Concept demos.** Each website package (Essential, Professional, Signature) gets a concept demo for a
fictional business, built in its own repository and published on its own. The portfolio only lists it in
`src/data/demos.ts` (package, published address, a real screenshot in `src/assets/shots/demos/`, and the
card's text in both languages); the Services section shows a card for each listed demo and none while the
list is empty.

**Contact.** The form prepares an email with the chosen service, or copies the same message; nothing is
sent from the page and no form service is used. `?plan=essential|professional|signature` (from the
package buttons and the demos) chooses the service. Without JavaScript it is a plain `mailto:` form.

## Motion

CSS and GSAP each own their own properties, so the two never animate the same thing.

| Animation | Tool | Purpose | Ingredients |
|---|---|---|---|
| Hero entrance: headline lines rise inside their line boxes (the italic one a beat later), then sentence, availability, buttons and the proof line | CSS keyframes on `html.intro` (first paint only) | Arrival | 900 ms lines (140 ms apart), 600 ms rest from 320 ms, proof line from 600 ms, `--ease-out`. The sentence only rises and is never transparent. `.intro` goes when the proof line has arrived (or after 4 s), and on any change of the setting, so the entrance never replays |
| Hover and press on buttons, links, the category index, thumbnails, the settings | CSS transitions | Feedback | 160 ms press to `scale(0.97)`; hover movement only with `(hover: hover) and (pointer: fine)` |
| Section entrances | GSAP `ScrollTrigger.batch` | Prevent content popping in | `autoAlpha` + 16 px, 0.55 s (0.45 s phones), 60 ms stagger, once |
| Case study head: name, kind, status in reading order | GSAP + ScrollTrigger | Explain hierarchy | 0.65 s, 80 ms stagger, once |
| Main screenshots (cases, the website card) surface from their bottom edge | GSAP + ScrollTrigger | Reveal | `clip-path`, 1.05 s (0.8 s phones), once |
| Secondary screenshots open one after another | GSAP + ScrollTrigger | Reading order | `clip-path` and 28 px, 0.9 s, 140 ms between screenshots, once |
| Lead screenshot drift (desktop) | GSAP ScrollTrigger `scrub: 0.3` | Depth | ±1.5 % on the `<picture>` wrapper, so the `<img>` keeps its hover zoom |
| Technical details settle in when opened | CSS keyframes | State | 320 ms fade and rise |
| Theme switch | View Transition (where supported) | Continuity | 260 ms crossfade of the page; instant when motion is reduced |
| Viewer: screenshot travels from its thumbnail and back; next/previous slide | GSAP (FLIP), one `gsap.context()` per viewing | Spatial continuity | 0.4 s open, 0.3 s close, 0.28 s slide; CSS fade is the fallback; the ground is the theme's `--canvas` |

`expo.out` in GSAP is the same curve as `--ease-out`.

**The visitor's setting.** The footer has an "Animations" control with three options: Device, On and
Reduced ("Animaciones": Dispositivo, Activadas, Reducidas). Under it, one sentence says what applies and
why, for example "Animations reduced, following your device setting." or "Animations on, your choice,
saved in this browser." Device follows `prefers-reduced-motion`, also when it changes while the page is
open; On and Reduced are explicit choices, kept in `localStorage` (`luisdataworks:motion`), that win over
the device on later visits. Choosing Device again removes the stored choice.

- An inline script in `Base.astro` sets `<html data-motion="on|off">` before the first paint. All motion CSS
  hangs on that attribute through `:where([data-motion="on"])`, so selector specificity is unchanged.
  Without JavaScript there is no attribute: nothing moves, nothing is hidden, and the control stays hidden.
- `motion-preference.ts` reads and changes the setting and fires a `motionchange` event.
- Switching to Reduced calls `stop()` in `motion.ts`: one `gsap.matchMedia().revert()` removes every tween
  and ScrollTrigger, inline styles are cleared and every element is shown, also mid-reveal. Switching to On
  calls `start()`, which never runs twice; what is still below the viewport waits again so it can enter.
  GSAP is fetched at most once per page, whatever the visitor switches.
- The viewer and the theme switch read the setting on every use.

**Loading.** `reveal.ts` imports `motion.ts` (GSAP + ScrollTrigger) once the page is idle, only while
animations are on (and not on data saver unless the visitor chose On). If the module fails, everything is
shown at once; if it takes over 4 s, the same.

**Not done on purpose.** No pinning, no smooth-scroll hijacking, no animated counters on the test figures,
no footer animation.

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
| How each project is installed, run and tested (`src/data/commands.ts`), its requirements | `README.md` of each repository, checked on 2026-10-29 (QuoteFlow on GitHub; LeadFlow and Book Data Extractor Pro on their local clones, identical to GitHub) |
| Each case study's problem and "what you can do" | written from its summary and features above; to be confirmed by Luis |
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

Updated CVs supplied by Luis on 2026-11-04 are copied without changing their
contents. Four PDFs are stored, by purpose and language:

- Developer English: `public/cv/Luis_Pimentel_CV_Developer_EN.pdf`
- Developer Spanish: `public/cv/Luis_Pimentel_CV_Desarrollador_ES.pdf`
- Freelance English: `public/cv/Luis_Pimentel_CV_Freelance_EN.pdf`
- Freelance Spanish: `public/cv/Luis_Pimentel_CV_Freelance_ES.pdf`

All rendered CV links use `cvByLanguage` in `src/data/links.ts`. Each page offers
only its own developer and freelance PDFs. The hero's main action, About and
footer download the developer CV; Services has one text link to the freelance
CV. Contact repeats those two downloads. The existing English Word download is
shown only on the English page; there is no Spanish Word link to an English file.
The legacy addresses `Luis_Pimentel_CV.pdf` and `Luis_Pimentel_CV_ES.pdf` contain
the same updated developer PDFs, so previous links keep working. The existing
`Luis_Pimentel_CV.docx` download is updated to the supplied English developer Word
file. Other editable Word versions remain outside the public directory.

No proficiency level or professional experience was added. The source documents
remain untouched. The public addresses are served by GitHub Pages after deployment.

Final-document verification: Luis confirmed that the previously supplied Claude
CV directory contains the final reviewed versions. All four PDFs match the
integrated files and the production build byte for byte. No PDF or DOCX was
replaced during the language-routing change.

## Checks run before handing over

These are the checks of the version published on 2026-10-25, before the editorial redesign (the blended
hero heading they mention no longer exists). Repeat them for the redesign before it is published.

Testing motion: headless Chrome inherits the operating system's animation setting. On a machine with
animations turned off it reports `prefers-reduced-motion: reduce`, the site correctly stays still and GSAP is
never loaded, so a motion test there says nothing about the animations. Emulate
`prefers-reduced-motion: no-preference` (or store the footer's choice, `luisdataworks:motion` = `on`) for the
motion runs, and keep a separate run with `reduce`.

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
