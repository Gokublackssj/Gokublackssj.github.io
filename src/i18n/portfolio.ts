// Approved bilingual editorial portfolio copy.
// Only facts already stated on the site: written proposal before starting,
// reviewable progress, public code, price based on scope, what packages
// include. No clients, results, years of experience or response times.
export const portfolioCopy = {
  es: {
    title: ["Webs y herramientas", "para que tu negocio se entienda y funcione mejor."],
    role: "Desarrollo web · Python y automatización",
    intro: "Creo sitios y catálogos para pequeños negocios, y automatizo tareas repetitivas cuando te hacen perder tiempo. Código público y propuesta por escrito antes de empezar.",
    ctaHero: "Cuéntame tu proyecto", projects: "Ver proyectos",
    work: "Proyectos que puedes abrir y revisar.",
    workText: "Demos web que puedes probar en tu navegador y herramientas en Python con su código en GitHub.",
    services: "En qué puedo ayudarte.",
    servicesText: "Elige por dónde empezar. Antes de comenzar recibes por escrito qué incluye, qué no y el precio según el alcance.",
    serviceItems: [
      { title: "Una web para tu negocio", text: "Una página clara que explique qué ofreces, se vea bien en el móvil y haga fácil escribirte o encontrarte. También puedo mejorar la web que ya tienes.", detail: "Diseño adaptable, SEO básico y accesibilidad incluidos", cta: "Consultar una web", plan: "website" },
      { title: "Catálogos de productos o servicios", text: "Ordena lo que vendes en categorías, con fotos, descripciones y precios, para que cada cliente encuentre lo que busca y sepa cómo pedirlo.", detail: "Para tiendas, restaurantes, alojamientos y servicios", cta: "Consultar un catálogo", plan: "catalog" },
      { title: "Automatización con Python", text: "Si copias datos entre archivos o revisas hojas de cálculo a mano, preparo una herramienta que importe, valide y ordene esa información.", detail: "Importación de archivos, scraping a Excel o CSV y APIs pequeñas", cta: "Consultar una automatización", plan: "automation" },
    ],
    webDemos: "Demos web para explorar:",
    process: { heading: "Cómo trabajo.", steps: [
      { title: "Conversamos sobre el proyecto", text: "Me cuentas qué necesitas y revisamos el punto de partida." },
      { title: "Definimos alcance y propuesta", text: "Acordamos qué se incluye y una propuesta por escrito antes de comenzar." },
      { title: "Desarrollo y revisiones", text: "Construyo y comparto avances para revisar contigo los detalles acordados." },
    ] },
    aboutTitle: "Sobre mí.", aboutLead: "Soy Luis, desarrollador web y Python. Creo webs para presentar tu negocio y herramientas para simplificar el trabajo con tus datos.",
    aboutText: "Antes de construir, definimos qué necesitas y qué incluye el proyecto. Recibes una propuesta por escrito y avances que puedes revisar durante el desarrollo.",
    aboutMore: "Puedes evaluar mi trabajo en las demos, los casos de estudio y el código público: qué resuelve cada proyecto, cómo está hecho y cuáles son sus límites.",
    facts: [
      ["Ubicación", "Potosí, Bolivia · Remoto (UTC−4)"],
      ["Idiomas", "Español; inglés principalmente por escrito"],
      ["Disponible para", "Proyectos freelance y puestos de desarrollador junior"],
    ],
    cv: "Ver CV de desarrollador", github: "Ver GitHub",
    back: "Volver arriba", social: "Perfiles profesionales", nav: "Navegación principal", theme: "Tema oscuro",
    cta: { full: "Cuéntame tu proyecto", short: "Escríbeme" }, menu: "Menú",
    contact: {
      heading: "Cuéntame tu proyecto.",
      text: "Cuéntame qué necesitas y qué te gustaría conseguir. No hace falta tenerlo todo definido.",
      form: {
        prepare: "Preparar mi mensaje",
        messageHint: "Describe tu objetivo, qué tienes ahora y cualquier fecha que debamos tener en cuenta.",
      },
    },
  },
  en: {
    title: ["Websites and tools", "that make your business clearer and easier to run."],
    role: "Web development · Python & automation",
    intro: "I build sites and catalogs for small businesses, and automate repetitive tasks when they cost you time. Public code and a written proposal before any work starts.",
    ctaHero: "Tell me about your project", projects: "View projects",
    work: "Projects you can open and check.",
    workText: "Web demos you can try in your browser and Python tools with their code on GitHub.",
    services: "How I can help.",
    servicesText: "Pick a starting point. Before any work begins, you get in writing what's included, what isn't and a price based on scope.",
    serviceItems: [
      { title: "A website for your business", text: "A clear site that explains what you offer, works well on phones and makes it easy to contact or find you. I can also improve the site you already have.", detail: "Responsive design, basic SEO and accessibility included", cta: "Ask about a website", plan: "website" },
      { title: "Product and service catalogs", text: "Organize what you sell into categories with photos, descriptions and prices, so each customer finds what they need and knows how to order.", detail: "For shops, restaurants, lodging and services", cta: "Ask about a catalog", plan: "catalog" },
      { title: "Python automation", text: "If you copy data between files or check spreadsheets by hand, I build a tool that imports, validates and organizes that information.", detail: "File imports, scraping to Excel or CSV and small APIs", cta: "Ask about automation", plan: "automation" },
    ],
    webDemos: "Web demos to explore:",
    process: { heading: "How I work.", steps: [
      { title: "We discuss your project", text: "You tell me what you need, and we review the starting point." },
      { title: "We define scope and proposal", text: "We agree on what is included and a written proposal before work begins." },
      { title: "Development and reviews", text: "I build and share progress so we can review the agreed details together." },
    ] },
    aboutTitle: "About me.", aboutLead: "I’m Luis, a web and Python developer. I build websites to present your business and tools to simplify working with your data.",
    aboutText: "Before building, we define what you need and what the project includes. You get a written proposal and progress you can review throughout development.",
    aboutMore: "You can assess my work through the demos, case studies and public code: what each project solves, how it is built and where its limits are.",
    facts: [
      ["Location", "Potosí, Bolivia · Remote (UTC−4)"],
      ["Languages", "Spanish; English mainly in writing"],
      ["Available for", "Freelance projects and junior developer roles"],
    ],
    cv: "View developer CV", github: "View GitHub",
    back: "Back to top", social: "Professional profiles", nav: "Main navigation", theme: "Dark theme",
    cta: { full: "Tell me about your project", short: "Contact me" }, menu: "Menu",
    contact: {
      heading: "Tell me about your project.",
      text: "Tell me what you need and what you would like to achieve. You do not need to have everything defined.",
      form: {
        prepare: "Prepare my message",
        messageHint: "Describe your goal, what you have now and any date we should consider.",
      },
    },
  },
} as const;
