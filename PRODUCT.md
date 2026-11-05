# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Prospective freelance clients of Luis Alvaro Pimentel Tacuri, with no single dominant group (confirmed 2026-10-29):

- small businesses that receive CSV, Excel or PDF files and process them by hand, and want them imported, cleaned or automated;
- Upwork clients comparing profiles for a concrete job (scraping, scripts, small APIs);
- technical teams or agencies subcontracting Python backend work, who read the code.

Their job on the site: decide in a few minutes whether Luis can do their data work, check that the claims hold, and get in touch.

## Product Purpose

A bilingual (English at `/`, Spanish at `/es/`) portfolio for freelance work and junior developer opportunities: websites for small businesses, and Python tools that turn manual data work into web tools. Success is a visitor who understands the problem, deliverable, evidence and contact path. A separate contact option supports junior-role enquiries. Public claims remain bounded by personal projects and fictional-business demos.

## Positioning

Predictable data (confirmed 2026-10-29): input is validated, duplicates are handled on purpose, nothing is saved or deleted without confirmation, and every claim on the site can be checked in the code. QuoteFlow embodies it: nothing is stored until a person confirms it.

## Operating Context

Visitors arrive from Upwork, GitHub, the CV or a direct link, on phones and desktops. Technical visitors open the repositories; non-technical ones look at screenshots and the services. Upwork's terms require that Upwork clients stay in Upwork Messages until a contract exists, so the site keeps that note.

## Capabilities and Constraints

- Junior Python developer in Potosí, Bolivia; first-year Computer Engineering student (Universidad Autónoma Tomás Frías); Spanish native, basic English. Remote freelance work.
- Services: data import and review tools; web scraping to Excel/CSV; APIs and small web apps (FastAPI, PostgreSQL, Next.js); data cleaning and spreadsheet automation.
- Website packages Essential, Professional and Signature (confirmed 2026-10-29), compared by deliverables and scope only; none needs a backend. Prices and delivery times are undecided: show "Based on scope" / "Según alcance" until they are defined. The data services (import tools, scraping, APIs, automation) stay a separate block.
- Each package will get a concept demo for a fictional business, built and published as its own site in its own repository, one at a time, and only after approval: Essential, a café; Professional, a boutique hotel; Signature, a contemporary silversmith's workshop inspired by Potosí. The portfolio keeps only each demo's card (src/data/demos.ts); until a demo is published it is listed as in progress, with no picture or link. Previews are short muted WebM/MP4 recordings of the published demo with a real screenshot as poster, never GIFs.
- Projects are shown in two categories, each project once: Python, data & automation first (QuoteFlow, LeadFlow, Book Data Extractor Pro), then Web development (this site and the package demos). Services connects a problem, deliverable, project evidence and the appropriate contact option. Website packages remain available.
- Contact: a form that prepares an email with the chosen service, or copies the message. No form provider or backend, no WhatsApp. It starts on "not sure yet". Approved commitments: first reply within 24 hours; English communication mainly written.
- FAQ answers on maintenance, code ownership, payments and revision rounds are pending a decision and stay hidden until approved (src/i18n, faq.items with pending: true).
- Static Astro site on GitHub Pages; no backend, no forms that submit anywhere, no trackers, cookies or analytics.

## Brand Commitments

- Wordmark: luisdataworks.
- Voice: plain, factual, first person; states limitations openly.
- Every visible string exists in both languages (`src/i18n/en.ts`, `src/i18n/es.ts`).

## Evidence on Hand

- Three personal projects with public code: QuoteFlow, LeadFlow, Book Data Extractor Pro (repositories in `src/data/links.ts`).
- Real test counts (QuoteFlow 512 backend + 46 frontend; LeadFlow 148 backend + 17 end-to-end), sourced in README.md "Content sources".
- Screenshots in `src/assets/shots/` (QuoteFlow and LeadFlow, fictitious data) and a 13 s LeadFlow screen recording in `public/media/`.
- Developer and freelance CVs in English and Spanish (four PDFs) in `public/cv/`, supplied on 2026-11-04. Existing developer PDF aliases and the English Word download remain current.
- Absent, never to be fabricated: clients, testimonials, reviews, business results, metrics, deployments, public demos, prices, personal photographs.

## Product Principles

1. Every claim is checkable: link it to the code or leave it out.
2. Show the real work first: screenshots and recordings of the actual projects.
3. State limitations as plainly as features.
4. Make contact easy and honest about how each channel works.

## Accessibility & Inclusion

WCAG 2.2 AA; full keyboard use; visible focus; `prefers-reduced-motion` respected, plus the site's own animations setting in the footer.
