import type { ImageMetadata } from "astro";
import { demos, isPublished } from "../data/demos";
import { repos } from "../data/links";
import { shots } from "../data/shots";
import { dicts, type Lang } from "../i18n";

export type LabProject = {
  id: string;
  name: string;
  kind: string;
  description: string;
  technologies: string[];
  href: string;
  action: string;
  repo: string;
  image?: ImageMetadata;
  alt: string;
};

// Lab wording for the two concept demos: who it is for, what it does. Facts
// come from src/data/demos.ts (features of the published demos).
const site = {
  aurea: {
    es: { kind: "Demo conceptual · Hotel ficticio", description: "Web de varias páginas para un hotel boutique: explorador de habitaciones, galerías y una reserva de demostración en cinco pasos, con animaciones ligadas al scroll." },
    en: { kind: "Concept demo · Fictional hotel", description: "A multi-page site for a boutique hotel: room explorer, galleries and a five-step demo booking, with scroll-linked animation." },
  },
  hervor: {
    es: { kind: "Demo conceptual · Cafetería ficticia", description: "Web de una página pensada para el móvil: carta por categorías, aviso de «abierto ahora» con el horario de Bolivia y una reserva de mesa que prepara el mensaje sin enviar datos." },
    en: { kind: "Concept demo · Fictional café", description: "A one-page, phone-first site: menu by category, an “open now” notice based on Bolivian hours and a table booking that prepares the message without sending data." },
  },
} as const;

// A small view of existing evidence, not another project catalogue.
export function labProjects(lang: Lang): { id: string; label: string; projects: LabProject[] }[] {
  const t = dicts[lang];
  const es = lang === "es";
  const details = es ? "/es/projects/" : "/projects/";
  const published = demos.filter(isPublished);
  const websites = (["aurea", "hervor"] as const).map((id): LabProject => {
    const demo = published.find((item) => item.id === id)!;
    return {
      id, name: id === "aurea" ? "Aurea" : "Hervor",
      kind: site[id][lang].kind,
      description: site[id][lang].description,
      technologies: id === "aurea" ? ["Astro", "TypeScript", "GSAP"] : ["HTML", "CSS", "JavaScript"],
      href: demo.url, action: es ? "Probar la demo" : "Try the demo",
      repo: demo.repo!, image: demo.media.desktop.poster, alt: demo.copy[lang].alt,
    };
  });
  const software: LabProject[] = [
    {
      id: "quoteflow", name: "QuoteFlow", kind: es ? "Proyecto personal · Revisión de importaciones" : "Personal project · Import review",
      description: es
        ? "Para quien pasa registros de archivos a otro sistema: sube un CSV, Excel o PDF, revisa las filas señaladas, corrige valores y confirma qué se guarda."
        : "For anyone moving records from files into another system: upload a CSV, Excel or PDF, review flagged rows, fix values and confirm what gets saved.", technologies: ["Python", "FastAPI", "PostgreSQL"],
      href: `${details}quoteflow/`, action: es ? "Leer la documentación" : "Read the docs",
      repo: repos.quoteflow, image: shots.quoteflow.lead.src, alt: t.quoteflow.shots.review![1]!,
    },
    {
      id: "leadflow", name: "LeadFlow", kind: es ? "Proyecto personal · Formulario y CRM" : "Personal project · Form and CRM",
      description: es
        ? "Para negocios que reciben consultas desde su web: guarda cada contacto sin duplicados y sigue su estado, notas e historial en un panel sencillo."
        : "For businesses that get enquiries through their site: stores each lead without duplicates and tracks status, notes and history in a simple panel.", technologies: ["Python", "FastAPI", "Next.js"],
      href: `${details}leadflow/`, action: es ? "Leer la documentación" : "Read the docs",
      repo: repos.leadflow, image: shots.leadflow.lead.src, alt: t.leadflow.shots.detail![1]!,
    },
    {
      id: "book-extractor", name: "Book Data Extractor", kind: es ? "Proyecto personal · Scraping" : "Personal project · Scraping",
      description: es
        ? "Pasa un catálogo web paginado a Excel y CSV: extrae título, precio, disponibilidad y enlace, limpia los datos y elimina duplicados. Pensado para sitios de práctica como books.toscrape.com."
        : "Turns a paginated web catalog into Excel and CSV: extracts title, price, availability and link, cleans the data and removes duplicates. Built for practice sites such as books.toscrape.com.", technologies: ["Python", "Playwright", "openpyxl"],
      href: `${details}book-extractor/`, action: es ? "Leer la documentación" : "Read the docs",
      repo: repos.bookExtractor, alt: "",
    },
  ];
  // Software opens its bilingual case study; website demos keep their published URLs.
  return [
    { id: "websites", label: es ? "Sitios web" : "Websites", projects: websites },
    { id: "software", label: es ? "Automatización y software" : "Automation & Software", projects: software },
  ];
}

export const copy = {
  es: {
    title: "El trabajo,", italic: "en perspectiva.",
    intro: "Sitios web con identidad. Herramientas que ordenan el trabajo. Una selección de lo que construyo.",
    back: "Volver al portafolio", lab: "Estudio de interacción", theme: "Tema oscuro", languages: "Idioma",
    categories: "Categoría de proyectos", previous: "Proyecto anterior", next: "Proyecto siguiente",
    help: "Rueda o desliza para elegir. En los extremos, el scroll continúa.",
    scene: "Rueda de proyectos. Usa las flechas izquierda y derecha, Inicio y Fin.",
    position: "de", code: "Código en GitHub", newTab: "se abre en una pestaña nueva",
    note: "Las webs son demos conceptuales para negocios ficticios. Todo el código es público en GitHub.",
    footer: "Una selección pequeña. Cada proyecto, una forma de resolver.",
    contact: "Hablemos de tu proyecto", sample: "Muestra real de salida · CSV", book: "Libro", price: "Precio",
    reduced: "Movimiento reducido: cambios instantáneos.",
  },
  en: {
    title: "The work,", italic: "in perspective.",
    intro: "Websites with an identity. Tools that bring order to work. A selection of what I build.",
    back: "Back to the portfolio", lab: "An interaction study", theme: "Dark theme", languages: "Language",
    categories: "Project category", previous: "Previous project", next: "Next project",
    help: "Scroll or swipe to choose. At either end, page scrolling continues.",
    scene: "Project wheel. Use Left and Right, Home and End.",
    position: "of", code: "Code on GitHub", newTab: "opens in a new tab",
    note: "The websites are concept demos for fictional businesses. All code is public on GitHub.",
    footer: "A small selection. A different problem behind each project.",
    contact: "Let's discuss your project", sample: "Real sample output · CSV", book: "Book", price: "Price",
    reduced: "Reduced motion: instant changes.",
  },
};
