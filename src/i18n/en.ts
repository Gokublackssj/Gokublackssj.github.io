// English content (default locale). Every fact here was checked against the
// project repositories; see README.md "Content sources" before changing it.

export const en = {
  lang: "en",
  locale: "en_US",
  meta: {
    title: "Luis Pimentel · Python developer for data-heavy web apps",
    description:
      "Junior Python developer in Potosí, Bolivia. Web apps that import, validate and review data, web scrapers and small APIs with FastAPI and PostgreSQL. Open to freelance work.",
    ogAlt: "QuoteFlow review screen with a corrected cell highlighted",
  },
  a11y: {
    skip: "Skip to content",
    home: "luisdataworks, back to top",
    menu: "Menu",
    mainNav: "Main",
    langLabel: "Language",
    newTab: "(opens in a new tab)",
    galleryOpen: "Open full-size screenshot",
    dialogLabel: "Screenshot viewer",
    close: "Close",
    prev: "Previous screenshot",
    next: "Next screenshot",
    counter: (i: number, n: number) => `${i} of ${n}`,
    phoneStrip: "Phone screenshots, scroll sideways",
    // Label of the header's theme switch; aria-pressed says whether it is on.
    themeDark: "Dark theme",
  },
  nav: {
    projects: "Projects",
    stack: "Stack",
    services: "Services",
    about: "About",
    contact: "Contact",
    cta: "Get in touch",
  },
  // The offer first (what a client gets), then who I am. The second line is
  // set in italic. primary is the contact action, secondary the projects.
  hero: {
    lines: ["I turn manual tasks into", "web tools that save time"],
    lead:
      "I build websites, APIs and Python automations that organize data, simplify processes and cut down repetitive work.",
    primary: "Get in touch",
    secondary: "See the projects",
    availability: "I'm Luis Pimentel, a Python developer in Potosí, Bolivia, open to remote freelance work.",
    // Proof under the actions: something a visitor can check, not a promise.
    proof: "The code of my projects is public on GitHub, with automated tests you can run yourself.",
  },
  projectsIntro: {
    heading: "Selected projects",
    text:
      "Two kinds of work, each in its own place: websites, and Python tools that handle data. Everything here has public code, and every feature, decision and test count comes from its repository, not from memory.",
    // The two categories, side by side at the top of the section. The counts
    // are computed from src/data (projects.ts and demos.ts).
    index: {
      label: "Project categories",
      web: (sites: number, demos: number, planned: number) =>
        [
          `${sites} ${sites === 1 ? "website" : "websites"}`,
          demos > 0 ? `${demos} concept ${demos === 1 ? "demo" : "demos"}` : "",
          planned > 0 ? `${planned} ${planned === 1 ? "demo" : "demos"} in progress` : "",
        ]
          .filter(Boolean)
          .join(", "),
      python: (projects: number) => `${projects} ${projects === 1 ? "project" : "projects"}`,
    },
  },
  // The two categories of work, named the same in Projects and Services.
  // Web development lists websites (src/data/projects.ts) and the concept
  // demos (src/data/demos.ts); the Python category is the case studies.
  families: {
    websites: {
      heading: "Web development",
      text: "Sites for a person, a business or a product: the design, the content and the publishing. Here are my own site and a concept demo for each website package.",
      index: "Websites for a person, a business or a product, and a concept demo for each package.",
      purpose: "Purpose",
      features: "What it has",
      live: "View the site",
      shotNote: "Screenshot of the site.",
    },
    software: {
      heading: "Python, data & automation",
      text: "Personal projects, not client work: tools that import, check and move data. Each one runs on your own machine, and its code is public on GitHub.",
      index: "Tools that import, check and move data: web apps, APIs, scraping and Excel or CSV exports.",
    },
  },
  websites: {
    portfolio: {
      name: "luisdataworks (this site)",
      purpose: "My bilingual portfolio: it presents my projects and services and makes it easy to get in touch.",
      features: [
        "English and Spanish versions, each with its own address",
        "Light and dark themes that remember the visitor's choice",
        "Animations that follow the reduced-motion setting",
        "No trackers, cookies or analytics",
        "Built with Astro and TypeScript, published by GitHub Actions on GitHub Pages",
      ],
      alt: "The first screen of this site: the headline, a short description and two buttons",
      altDark: "The first screen of this site in the dark theme",
    },
  },
  labels: {
    problem: "The problem",
    solution: "What I built",
    canDo: "What you can do with it",
    details: "Technical details",
    detailsHint: "Features, decisions, tests and limitations",
    run: "How it runs",
    howToRun: "How to run it",
    requirements: "Requirements",
    whatItDoes: "What it does",
    features: "Features",
    decisions: "Technical decisions",
    tests: "Tests you can run",
    limits: "Known limitations",
    builtWith: "Built with",
    gallery: "Screenshots",
    phone: "On a phone",
    repo: "Code on GitHub",
    demo: "Live demo",
    status: "Status",
    usefulIf: "Useful if",
    license: "License",
  },
  quoteflow: {
    name: "QuoteFlow",
    kind: "Import quotes from CSV, Excel and PDF, with human review",
    status: "Personal project with public code. It runs on your own machine; there is no public demo. Its interface is in Spanish.",
    // The business problem it answers, in one line, after "Useful if".
    usefulIf: "your business receives quotes, price lists or orders as CSV, Excel or PDF files, and someone types them into a system by hand.",
    summary:
      "QuoteFlow imports quotes from CSV, XLSX and PDF files. Each file is parsed in an isolated process, validated and checked for duplicates, then held for review. Nothing is saved as a record until a person confirms it.",
    // Problem and what a user can do: plain-language readings of the summary
    // and features above, for visitors who are not developers.
    problem:
      "Quotes arrive as CSV, Excel and PDF files. Typing them into a system by hand is slow, and a wrong value or a repeated row is easy to miss and hard to undo once it is saved.",
    canDo: [
      "Upload a CSV, Excel or PDF file and see every row checked before anything is saved",
      "Filter the rows by status and decision, then accept, exclude or correct them, one by one or in bulk",
      "See each corrected value highlighted, with the original value struck through",
      "Confirm the import after a summary of how many rows will be saved and how many excluded",
      "Browse the records each confirmed import saved",
    ],
    features: [
      ["Import pipeline", "Upload, isolated parsing with size, row and time limits, validation, and duplicate detection against the user's own records."],
      ["Human review", "Filter rows by status and decision, accept or exclude them one by one or in bulk, and correct cells. A corrected cell stays highlighted, with the original value struck through."],
      ["Explicit confirmation", "A dialog states how many rows will be saved and how many excluded before anything is stored."],
      ["Saved records", "Each confirmed import lists the records it stored, paginated and read-only."],
      ["Sessions", "Cookie sessions with CSRF protection, Argon2 password hashing and login rate limiting. The page warns before an idle session expires, and unsaved corrections can be recovered after logging in again."],
      ["Audit log", "Imports and logins are logged, with email addresses pseudonymized."],
      ["n8n integration (optional)", "An endpoint that accepts files with a bearer token and an Idempotency-Key. Run by hand against the test database: the first call returned 201, the replay with the same key returned 200 with the same batch. Disabled unless configured."],
    ],
    decisions: [
      ["Nothing is stored without approval.", "Rows wait in a temporary table. Confirming saves the accepted rows of the chosen sheet and deletes every temporary row of the batch in one transaction; any error rolls back."],
      ["Duplicates are private.", "Rows are compared only with records confirmed by the same user. Other users' records are never compared or revealed."],
      ["Invalid rows cannot be accepted.", "A request that tries to accept an invalid or empty row is rejected whole, with a 422."],
      ["Uploads never touch the disk.", "The file is read in memory with a size limit and hashed with SHA-256; it is not written to disk or stored in the database."],
      ["Production mode refuses unsafe settings.", "With QF_ENV=production the API will not start without secure cookies, HTTPS origins and fresh secrets."],
    ],
    tests: [
      ["512", "backend tests", "pytest, against a separate test database that is emptied between tests"],
      ["46", "frontend tests", "node:test, against the production build with a fake API"],
    ],
    testsNote: "Also checked with Ruff (lint and format), ESLint and the TypeScript compiler.",
    // How to run it: one label per command block in src/data/commands.ts.
    requirements: "Docker with Compose, Python 3.12 or later (developed and tested on CPython 3.14), Node.js 24 and npm.",
    runNote: "A fresh install on Windows PowerShell, as the project's README gives it. The README also covers an existing database, macOS and Linux.",
    runSteps: [
      "Settings: copy the example, then replace every “change-me” value",
      "Check that no database exists yet: this command must fail with “no such volume”",
      "Start PostgreSQL, with the main and the test database",
      "Backend: virtual environment and the exact versions the tests passed with",
      "Databases: the test one, then the main one (“alembic current” must print no revision)",
      "Development admin user, then the API on port 8000",
      "Frontend, in a second terminal; then open http://localhost:3000",
    ],
    limits: [
      "The interface is in Spanish only, and times are always shown in the America/La_Paz time zone.",
      "Saved records can be browsed per import; there is no search across imports yet.",
      "Expired reviews are purged by a command that has to be scheduled separately.",
      "Not production-ready: HTTPS deployment, secret rotation, upload concurrency limits and an OS-level memory limit for parsing are still open.",
    ],
    stack: "Python, FastAPI, SQLAlchemy 2, Alembic, psycopg 3, Argon2, PyJWT, openpyxl, pypdf, PostgreSQL 18, Next.js 16, React 19, TypeScript, Docker Compose, pytest, node:test, Ruff, ESLint",
    demo: "No public demo: it runs locally.",
    license: "MIT",
    shots: {
      correction: ["Review screen: a corrected email is highlighted and the original value is struck through.", "QuoteFlow review table with a corrected email cell highlighted"],
      review: ["Review: steps, row filters by status and decision, and sheet options.", "QuoteFlow review screen with steps, filters and sheet options"],
      confirm: ["Confirmation dialog: 6 rows will be saved and 2 excluded.", "QuoteFlow confirmation dialog over the review table"],
      rejected: ["An unsupported file is rejected with the reason.", "QuoteFlow upload form showing that .txt files are not accepted"],
      imports: ["Imports list: one file in review, one imported.", "QuoteFlow imports list with two files"],
      saved: ["Records saved by a confirmed import, read-only.", "QuoteFlow table of saved records"],
      dark: ["The review screen in dark mode.", "QuoteFlow review screen in dark mode"],
      mobileImports: ["Imports on a phone.", "QuoteFlow imports list on a phone"],
      mobileReview: ["Review rows become labelled cards on a phone.", "QuoteFlow review rows shown as cards on a phone"],
      mobileSaved: ["Saved records on a phone.", "QuoteFlow saved records on a phone"],
    },
  },
  leadflow: {
    name: "LeadFlow",
    kind: "Lead capture form and a small CRM",
    status: "Personal project with public code. It runs on your own machine and has no user accounts, so it is meant for local use.",
    usefulIf: "enquiries reach you through a form on your website and you need to follow up each one, without duplicates and without losing track.",
    summary:
      "LeadFlow captures leads from a web form, stores them in PostgreSQL without duplicates, and tracks each lead's status, follow-up notes and history in a simple CRM panel.",
    problem:
      "Enquiries from a website form tend to end up in an inbox or a spreadsheet. The same person can be saved twice, and it becomes hard to see who was contacted, what was said and what comes next.",
    canDo: [
      "Send a lead through a form that points out each error next to its field",
      "Send the same lead twice and get the existing record back instead of a duplicate",
      "Search the leads by name or email and filter them by status",
      "Change a lead's status with an optional reason",
      "Add follow-up notes and read each lead's history",
    ],
    features: [
      ["Validated form", "Checks run in the browser and on the server; server errors appear next to the field they belong to."],
      ["Idempotent submissions", "Each submission carries an event_id, so a retried submission never creates a second row."],
      ["No duplicate leads", "The same email from the same source is recognized as an existing lead. Both rules are enforced by UNIQUE constraints in PostgreSQL."],
      ["CRM panel", "Paginated list with search by name or email, a status filter, status changes with an optional reason, follow-up notes and history."],
      ["Clean error log", "Errors are stored after removing passwords, tokens, emails and phone numbers."],
    ],
    decisions: [
      ["The browser never calls the API directly.", "Next.js server routes forward each request to FastAPI with a timeout and return generic messages, so internal details stay hidden."],
      ["The proxy only accepts JSON.", "Other content types get a 415 and bodies over 64 KB get a 413, so another site open in the browser cannot post forms to it."],
      ["Logs carry identifiers only.", "event_id and lead_id, never names, emails or the text of notes."],
    ],
    tests: [
      ["148", "backend tests", "pytest, against a separate test database"],
      ["17", "end-to-end tests", "Playwright in Chromium, with the API simulated in the browser"],
    ],
    testsNote: "Code checked with Ruff.",
    requirements: "Node.js 20 or later (tested with 24), Python 3.11 or later (tested with 3.14) and PostgreSQL 18, with Docker Desktop or a local install.",
    runNote: "Windows PowerShell, as the project's README gives it.",
    runSteps: [
      "Settings: both files are ignored by Git; the example values work as they are with Docker",
      "Database: wait until it shows “healthy”",
      "Backend, terminal 1; the API documentation is at http://localhost:8000/docs",
      "Frontend, terminal 2: the form at http://localhost:3000 and the CRM at /crm",
    ],
    limits: [
      "No authentication: anyone with access can read and change every lead, so it is meant for local use only.",
      "No migrations: tables are created if missing, but changes to existing tables are not applied.",
      "No deployment, no Dockerfiles for the apps and no continuous integration.",
    ],
    stack: "Python, FastAPI, Pydantic 2, SQLAlchemy 2, psycopg 3, PostgreSQL 18, Next.js 16, React 19, TypeScript, Docker Compose, pytest, Playwright, Ruff",
    demo: "No public demo: it runs locally.",
    license: "",
    video: [
      "Register a lead, open it in the CRM, change its status and add a note. Fictitious data, with the API simulated in the browser.",
      "Screen recording of LeadFlow: filling in the form, then updating the lead in the CRM",
      "Play the demo (0:13)",
      "The whole flow in 13 seconds",
    ],
    shotsNote: "Fictitious data. Captured from the production build of the frontend, with the API simulated in the browser the same way the project's end-to-end tests do it.",
    shots: {
      detail: ["CRM panel: a lead's details, status change and history of notes.", "LeadFlow CRM with a lead's details and history"],
      list: ["Lead list with status badges and pagination.", "LeadFlow CRM lead list"],
      formError: ["A server-side validation error shown next to the email field.", "LeadFlow form with an invalid email highlighted"],
      duplicate: ["Submitting an existing lead returns the existing record.", "LeadFlow form showing a lead was already registered"],
      filter: ["Filtering the list by status.", "LeadFlow CRM filtered by status"],
      dark: ["The CRM in dark mode.", "LeadFlow CRM in dark mode"],
      mobileForm: ["The lead form on a phone.", "LeadFlow form on a phone"],
      mobileCrm: ["The CRM list on a phone.", "LeadFlow CRM list on a phone"],
    },
  },
  bookExtractor: {
    name: "Book Data Extractor Pro",
    kind: "Python web scraper with Excel and CSV export",
    status: "Personal project with public code. It runs on your own machine; its tests run on GitHub Actions.",
    usefulIf: "you need the data from a public online catalogue in a spreadsheet, without copying it page by page.",
    summary:
      "Extracts title, price, currency, availability and URL from a paginated book catalog with Playwright, cleans the data, removes duplicates and exports Excel and CSV files. Built for scraping-practice sites such as books.toscrape.com.",
    problem:
      "Copying product data from an online catalog, page after page, into a spreadsheet is slow, and it leaves inconsistent prices, missing fields and repeated rows.",
    canDo: [
      "Run one command and get the title, price, currency, availability and link of each product",
      "Open the result as a formatted Excel file or an Excel-compatible CSV",
      "See missing fields flagged instead of silently dropped",
      "Point it at another catalog by writing a small site profile, without changing the code",
    ],
    features: [
      "Selectors live in JSON site profiles, separate from the scraping engine",
      "Prices parsed with Decimal; missing fields flagged instead of dropped",
      "Duplicates removed by normalized URL",
      "Formatted Excel output and Excel-compatible CSV with formula-injection mitigation",
      "Offline pytest unit tests run on GitHub Actions",
    ],
    limits: "Works on catalogs whose products are in the page HTML and paginate with links. No logins, captchas or infinite scroll.",
    requirements: "Python 3.11, 3.12 or 3.13, and an internet connection.",
    runNote: "Windows PowerShell, as the project's README gives it; the README also covers macOS and Linux.",
    runSteps: [
      "Virtual environment, dependencies and the Chromium browser for Playwright",
      "Collect the first 50 books",
      "Another catalog, with your own site profile",
    ],
    stack: "Python, Playwright, openpyxl, pytest, GitHub Actions",
  },
  stack: {
    heading: "Tools I use",
    text: "Only what these projects actually use, and where you can see each tool.",
    groups: [
      { name: "Languages", items: [["Python", "QF · LF · BDE"], ["TypeScript", "QF · LF"], ["JavaScript", "QF"]] },
      { name: "Frameworks and libraries", items: [["FastAPI", "QF · LF"], ["Pydantic 2", "QF · LF"], ["SQLAlchemy 2", "QF · LF"], ["Alembic", "QF"], ["Next.js 16 and React 19", "QF · LF"], ["Playwright (scraping)", "BDE"], ["openpyxl", "QF · BDE"], ["pypdf", "QF"]] },
      { name: "Databases", items: [["PostgreSQL 18", "QF · LF"]] },
      { name: "Tools", items: [["pytest", "QF · LF · BDE"], ["Playwright Test", "LF"], ["node:test", "QF"], ["Ruff", "QF · LF"], ["Docker Compose", "QF · LF"], ["GitHub Actions", "BDE"], ["n8n", "QF"], ["Git and GitHub", "QF · LF · BDE"]] },
    ],
    legend: "QF QuoteFlow · LF LeadFlow · BDE Book Data Extractor Pro",
  },
  // Concept demos, one per package, each its own site (src/data/demos.ts),
  // shown in Web development. Only published demos get a preview; the others
  // are listed as in progress.
  demos: {
    heading: "What each package looks like",
    text: "One concept demo per package, each a separate site for a fictional business. A demo appears here once it is built and published.",
    concept: "Concept demo: a fictional business",
    inProgress: "In progress",
    comingText: "Not published yet. Its preview and link will appear here when it is.",
    goal: "Goal",
    features: "What it shows",
    open: "Open the demo",
    view: "Preview size",
    desktop: "Desktop",
    mobile: "Mobile",
    play: "Play the preview",
    pause: "Pause the preview",
    // The fictional business each package's demo is designed for.
    business: {
      essential: "Café",
      professional: "Boutique hotel",
      signature: "Contemporary silversmith's workshop, inspired by Potosí",
    },
  },
  // Services: the offer only. The website packages first, then the Python,
  // data and automation work; each block links to its category in Projects.
  services: {
    heading: "Services",
    text: "Two kinds of work: websites in three packages, and Python tools that handle data. Prices depend on the scope, so each project starts with a short conversation.",
    packages: {
      heading: "Web development",
      // Leads to the Web development category in Projects.
      see: "See my site and the concept demos in Web development",
      text: "Three packages that differ in scope, design and interaction, not only in size. None of them needs a backend.",
      caption: "What each website package includes",
      rows: {
        best: "Best for",
        size: "Pages and sections",
        design: "Design",
        interactions: "Interactions",
        motion: "Animation",
        contact: "Contact",
        price: "Price",
      },
      items: {
        essential: {
          name: "Essential",
          best: "A café, a shop or a professional who needs a clear presence and an easy way to be contacted",
          size: "One page with up to six sections",
          design: "A clean layout adapted to your brand colours, fonts and photos",
          interactions: "Links to call, write or find you on a map",
          motion: "Subtle entrances as the page scrolls",
          contact: "A link to your email or WhatsApp",
        },
        professional: {
          name: "Professional",
          best: "A hotel, a clinic or a business with several services that need their own space",
          size: "Up to five pages, or one long page with up to ten sections",
          design: "A custom design for your brand, with its own components",
          interactions: "An image gallery with a full-screen viewer, and pages for each service",
          motion: "Coordinated scroll and section animations",
          contact: "A contact form; an external form service, if you want one, is a separate cost",
        },
        signature: {
          name: "Signature",
          best: "A brand that wants its website to be part of how people remember it",
          size: "One main experience page, plus up to four supporting pages",
          design: "Original art direction: a visual concept created for your brand",
          interactions: "Interactions designed for your content, such as a story told as the page scrolls",
          motion: "Elaborate scroll-driven animation and custom micro-interactions, with a reduced-motion version",
          contact: "As in Professional",
        },
      },
      price: "Based on project scope",
      included: "Every package includes a responsive design, basic SEO, accessibility and a site ready to publish as static files.",
      excluded: "Not included unless agreed separately: a backend, an online shop, a content management system or user accounts.",
      cta: "I want a site like this",
    },
    data: {
      heading: "Python, data & automation",
      text: "Freelance work in the same areas as my Python projects: tools for your data and your process.",
      see: "See the projects in Python, data & automation",
      items: [
        ["Data import and review tools", "Upload CSV, Excel or PDF files, validate every row, flag duplicates and let a person approve the result before it is saved."],
        ["Web scraping to Excel or CSV", "Collect specific fields from pages you are allowed to scrape and deliver clean, deduplicated spreadsheets."],
        ["APIs and small web apps", "FastAPI and PostgreSQL backends with input validation and duplicate protection, connected to a Next.js interface."],
        ["Data cleaning and spreadsheet automation", "Turn repeated manual steps into a script: exact number parsing, normalized values and formatted Excel output."],
      ],
    },
  },
  // How a project goes, from the first message to the delivery.
  process: {
    heading: "How we work",
    text: "Four steps, from your first message to the delivery.",
    steps: [
      ["A first conversation", "You tell me what takes your team time, or what your website needs to do. I ask what I need to understand the problem before suggesting anything."],
      ["A written proposal", "Before I start, you receive in writing what I will deliver, what is included and what is not."],
      ["Work you can review", "While I work, I share progress you can open and check, so you can see that it is going in the right direction."],
      ["Delivery", "You receive the code and the documentation agreed in the proposal."],
    ],
  },
  // Questions a client asks before writing. Entries marked pending wait for a
  // decision (maintenance, ownership, payments, revisions) and are not shown.
  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        q: "Who registers the domain, and where is the site published?",
        a: "We agree on both in the written proposal, before I start. The websites I build are static files, so they can be published on many hosts, including free static hosting such as GitHub Pages.",
        pending: false,
      },
      {
        q: "What do I need to provide?",
        a: "For a website: your texts, your logo, the photos you want to use and your business details, such as what you offer, your hours, where you are and how to contact you. For a data tool: example files with the real data removed or replaced, and a short description of what you do with them today. Please don't send passwords or sensitive personal data.",
        pending: false,
      },
      {
        q: "How quickly do you reply, and in which language?",
        a: "I reply within 24 hours. I work in Spanish; in English, our communication will be mainly written.",
        pending: false,
      },
      { q: "Is maintenance included?", a: "", pending: true },
      { q: "Who owns the code?", a: "", pending: true },
      { q: "How are payments made?", a: "", pending: true },
      { q: "How many rounds of changes are included?", a: "", pending: true },
    ],
  },
  // About, written for a client: the problem first, then who I am.
  about: {
    heading: "About",
    body: [
      "If someone in your business copies data from Excel or PDF files into another system, checks it by hand and mistakes still get through, I can automate that work. I build tools that check the information, keep the process in order and let you review the data before it is saved.",
      "I also build professional websites, so your customers understand what you offer and how to reach you.",
      "I'm Luis Pimentel, a junior Python developer working remotely from Potosí, Bolivia, with Python, FastAPI and PostgreSQL, and with frontend tools such as Next.js when a project needs an interface. I work in Spanish; in English, our communication will be mainly written.",
    ],
    cta: "Tell me about your project",
  },
  contact: {
    heading: "Contact",
    text: "Tell me what you need. The form prepares an email for you; nothing is sent from this page.",
    availability: "Available for freelance projects, remote.",
    email: "Email",
    github: "GitHub",
    upworkLabel: "Upwork",
    upworkValue: "View profile",
    cv: "CV",
    cvPdf: "CV (PDF)",
    cvDocx: "CV (Word)",
    // CV files in the contact section: [visible label, accessible name, file].
    cvFiles: [
      ["PDF", "CV (PDF)", "cvPdf"],
      ["Word", "CV (Word)", "cvDocx"],
    ],
    mailSubject: "Project enquiry from your portfolio",
    privacy: "Please don't include passwords, credentials or sensitive personal data in your first message.",
    upworkNote: "Found me on Upwork? Please keep all communication in Upwork Messages until a contract is in place, as Upwork's terms require.",
    // The form that prepares the email. Its options' ids are the `?plan=`
    // values the package buttons and the demos link to.
    form: {
      service: "What do you need?",
      // The first option is the one selected when no package was chosen.
      services: [
        ["other", "I'm not sure yet"],
        ["essential", "Website: Essential"],
        ["professional", "Website: Professional"],
        ["signature", "Website: Signature"],
        ["import-tool", "Data import and review tool"],
        ["scraping", "Web scraping to Excel or CSV"],
        ["api", "API or small web app"],
        ["automation", "Data cleaning and spreadsheet automation"],
      ],
      name: "Your name",
      optional: "optional",
      message: "Your message",
      messageHint: "A few lines about your business or your data are enough.",
      messageError: "Write a few lines so I know what you need.",
      prepare: "Prepare the email",
      copy: "Copy the message",
      copied: "Message copied. Paste it into an email to the address below.",
      copyFailed: "This browser did not let the page copy. Select the message below and copy it.",
      opened: "Your email app should open with the message ready. It is not sent until you send it from there. If the app does not open, copy the message instead.",
      how: "Nothing is sent from this page: your email app opens with the message ready, or you can copy it.",
      subject: "Project enquiry",
      bodyService: "Service",
      bodyName: "Name",
      preview: "The message",
    },
    directly: "Or write directly",
    // What happens after the email is prepared, and what to expect.
    next: {
      heading: "What happens next",
      steps: [
        "Your email app opens with the message ready, or you copy it.",
        "You send it from your own email; nothing is sent from this page.",
        "I reply within 24 hours to ask what I need and plan a first conversation.",
      ],
    },
    language: "I work in Spanish; in English, our communication will be mainly written.",
    timezone: "I'm in Potosí, Bolivia (UTC−4).",
  },
  footer: {
    line: "Websites and Python tools, from Potosí, Bolivia.",
    note: "Built with Astro. No trackers, cookies or analytics.",
    top: "Back to top",
    // The animations setting: follow the device, or the visitor's own choice.
    motion: {
      label: "Animations",
      system: "Device",
      on: "On",
      off: "Reduced",
      stateOn: "Animations on",
      stateOff: "Animations reduced",
      fromSystem: "following your device setting",
      fromChoice: "your choice, saved in this browser",
    },
  },
};

export type Dict = typeof en;
