import type { Lang } from "../i18n";

// The main technologies of each case study and what they do in that project.
// Every role restates a fact already shown on the project page (its features,
// test counts and architecture notes); the full list stays in each project's
// `stack` string and the rest is shown as "other tools".
export type StackRole = { name: string; role: Record<Lang, string> };
export type StackProject = "quoteflow" | "leadflow" | "book-extractor";

const r = (name: string, es: string, en: string): StackRole => ({ name, role: { es, en } });

export const primaryStack: Record<StackProject, StackRole[]> = {
  quoteflow: [
    r("Python", "Análisis y validación de archivos CSV, Excel y PDF", "Parsing and validating CSV, Excel and PDF files"),
    r("FastAPI", "API del backend", "Backend API"),
    r("PostgreSQL", "Registros guardados, usuarios y auditoría", "Saved records, users and audit log"),
    r("Next.js", "Aplicación web de revisión", "Review web app"),
    r("React", "Tabla de revisión y diálogos de confirmación", "Review table and confirmation dialogs"),
    r("TypeScript", "Código del frontend", "Frontend code"),
    r("pytest", "512 pruebas de backend", "512 backend tests"),
  ],
  leadflow: [
    r("Python", "Backend y pruebas", "Backend and tests"),
    r("FastAPI", "API de leads, estados y notas", "API for leads, statuses and notes"),
    r("PostgreSQL", "Leads sin duplicados, con restricciones UNIQUE", "Duplicate-free leads, with UNIQUE constraints"),
    r("Next.js", "Formulario, CRM y rutas de servidor hacia la API", "Form, CRM and server routes to the API"),
    r("TypeScript", "Código del frontend", "Frontend code"),
    r("pytest", "148 pruebas de backend", "148 backend tests"),
    r("Playwright", "17 pruebas de extremo a extremo", "17 end-to-end tests"),
  ],
  "book-extractor": [
    r("Python", "Motor del scraper, limpieza y duplicados", "Scraper engine, cleaning and de-duplication"),
    r("Playwright", "Recorre el catálogo paginado", "Walks the paginated catalog"),
    r("openpyxl", "Excel con formato", "Formatted Excel output"),
    r("pytest", "Pruebas unitarias sin conexión", "Offline unit tests"),
    r("GitHub Actions", "Ejecuta las pruebas en GitHub", "Runs the tests on GitHub"),
  ],
};

/** Stack entries not among the main ones (versions ignored when matching). */
export function otherTools(project: StackProject, stack: string) {
  const base = (name: string) => name.trim().toLowerCase().replace(/\s+\d[\d.]*$/, "");
  const main = new Set(primaryStack[project].map((item) => base(item.name)));
  return stack.split(",").map((item) => item.trim()).filter((item) => item && !main.has(base(item)));
}
