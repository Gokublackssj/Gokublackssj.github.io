import python from "./assets/simple-icons/python.svg?url";
import typescript from "./assets/simple-icons/typescript.svg?url";
import react from "./assets/simple-icons/react.svg?url";
import astro from "./assets/simple-icons/astro.svg?url";
import fastapi from "./assets/simple-icons/fastapi.svg?url";
import postgresql from "./assets/simple-icons/postgresql.svg?url";
import git from "./assets/simple-icons/git.svg?url";
import { repos } from "../data/links";
import { websites } from "../data/projects";

// Brand colours are the official hex values from Simple Icons' metadata at the
// pinned commit (see assets/simple-icons/sources.json). The SVG shapes are the
// unmodified files, painted through a CSS mask on a dark tile; every colour
// measures at least 3.5:1 against that tile. Docker is not shown as a logo
// (its trademark guidelines require authorization); it stays as text where
// projects describe their stack. Links go to the real repositories while the
// project detail pages do not exist yet.
const portfolioRepo = websites[0]!.repo!;

export type Technology = { name: string; icon: string; color: string; project: string; href: string };

export const technologyGroups: { id: string; label: { es: string; en: string }; items: Technology[] }[] = [
  {
    id: "web",
    label: { es: "Web", en: "Web" },
    items: [
      { name: "Astro", icon: astro, color: "#BC52EE", project: "portfolio", href: portfolioRepo },
      { name: "TypeScript", icon: typescript, color: "#3178C6", project: "LeadFlow", href: repos.leadflow },
      { name: "React", icon: react, color: "#61DAFB", project: "QuoteFlow", href: repos.quoteflow },
    ],
  },
  {
    id: "python",
    label: { es: "Python", en: "Python" },
    items: [
      { name: "Python", icon: python, color: "#3776AB", project: "QuoteFlow", href: repos.quoteflow },
      { name: "FastAPI", icon: fastapi, color: "#009688", project: "QuoteFlow", href: repos.quoteflow },
    ],
  },
  {
    id: "data",
    label: { es: "Datos y herramientas", en: "Data and tools" },
    items: [
      { name: "PostgreSQL", icon: postgresql, color: "#4169E1", project: "LeadFlow", href: repos.leadflow },
      { name: "Git", icon: git, color: "#F03C2E", project: "portfolio", href: portfolioRepo },
    ],
  },
];

export const palettes = [
  { id: "a", colors: ["#F8F9FA", "#E8EAED", "#22252A", "#728096"], es: "Porcelana y grafito", en: "Porcelain & graphite", description: { es: "A · Neutra, con acentos de pizarra y superficies de porcelana.", en: "A · Neutral, with slate accents and porcelain surfaces." } },
  { id: "b", colors: ["#F7F9FD", "#DCE7F7", "#25334C", "#7292CD"], es: "Blanco y azul hielo", en: "White & ice blue", description: { es: "B · Luminosa, con capas de azul hielo y contraste azul tinta.", en: "B · Luminous, with ice-blue layers and ink-blue contrast." } },
  { id: "c", colors: ["#FAF9FD", "#E9E3F5", "#29263B", "#9B8BC7"], es: "Blanco y violeta suave", en: "White & soft violet", description: { es: "C · Suave, con matices lavanda y contraste violeta oscuro.", en: "C · Soft, with lavender tones and deep-violet contrast." } },
] as const;
