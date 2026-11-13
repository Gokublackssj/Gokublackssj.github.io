import python from "./assets/devicon/python.svg?url";
import typescript from "./assets/devicon/typescript.svg?url";
import javascript from "./assets/devicon/javascript.svg?url";
import html5 from "./assets/devicon/html5.svg?url";
import react from "./assets/devicon/react.svg?url";
import nextjs from "./assets/devicon/nextjs.svg?url";
import astro from "./assets/devicon/astro.svg?url";
import fastapi from "./assets/devicon/fastapi.svg?url";
import postgresql from "./assets/devicon/postgresql.svg?url";
import git from "./assets/devicon/git.svg?url";
import playwright from "./assets/devicon/playwright.svg?url";
import pytest from "./assets/devicon/pytest.svg?url";
import { repos } from "../data/links";
import { websites } from "../data/projects";

// Original Devicon SVGs, pinned to v2.18.0 (assets/devicon/sources.json).
// TechnologyIcon renders the shared catalog; project links stay factual.
// Only technologies with a public project behind them (checked against each
// repository's manifests); secondary tools live in each project's page.
const portfolioRepo = websites[0]!.repo!;

export type Technology = { name: string; icon: string; color: string; project: string; href: string };

export const technologyGroups: { id: string; label: { es: string; en: string }; items: Technology[] }[] = [
  {
    id: "frontend",
    label: { es: "Frontend", en: "Frontend" },
    items: [
      { name: "HTML/CSS", icon: html5, color: "#E34F26", project: "portfolio", href: portfolioRepo },
      { name: "JavaScript", icon: javascript, color: "#F0DB4F", project: "QuoteFlow", href: repos.quoteflow },
      { name: "TypeScript", icon: typescript, color: "#3178C6", project: "LeadFlow", href: repos.leadflow },
      { name: "React", icon: react, color: "#61DAFB", project: "QuoteFlow", href: repos.quoteflow },
      { name: "Next.js", icon: nextjs, color: "#000000", project: "LeadFlow", href: repos.leadflow },
      { name: "Astro", icon: astro, color: "#BC52EE", project: "portfolio", href: portfolioRepo },
    ],
  },
  {
    id: "backend",
    label: { es: "Backend", en: "Backend" },
    items: [
      { name: "Python", icon: python, color: "#3776AB", project: "QuoteFlow", href: repos.quoteflow },
      { name: "FastAPI", icon: fastapi, color: "#009688", project: "QuoteFlow", href: repos.quoteflow },
      { name: "PostgreSQL", icon: postgresql, color: "#4169E1", project: "LeadFlow", href: repos.leadflow },
    ],
  },
  {
    id: "tools",
    label: { es: "Herramientas", en: "Tools" },
    items: [
      { name: "Git", icon: git, color: "#F03C2E", project: "portfolio", href: portfolioRepo },
      { name: "Playwright", icon: playwright, color: "#2EAD33", project: "Book Data Extractor", href: repos.bookExtractor },
      { name: "pytest", icon: pytest, color: "#0A9EDC", project: "LeadFlow", href: repos.leadflow },
    ],
  },
];

export const palettes = [
  { id: "a", colors: ["#F8F9FA", "#E8EAED", "#22252A", "#728096"], es: "Porcelana y grafito", en: "Porcelain & graphite", description: { es: "A · Neutra, con acentos de pizarra y superficies de porcelana.", en: "A · Neutral, with slate accents and porcelain surfaces." } },
  { id: "b", colors: ["#F7F9FD", "#DCE7F7", "#25334C", "#7292CD"], es: "Blanco y azul hielo", en: "White & ice blue", description: { es: "B · Luminosa, con capas de azul hielo y contraste azul tinta.", en: "B · Luminous, with ice-blue layers and ink-blue contrast." } },
  { id: "c", colors: ["#FAF9FD", "#E9E3F5", "#29263B", "#9B8BC7"], es: "Blanco y violeta suave", en: "White & soft violet", description: { es: "C · Suave, con matices lavanda y contraste violeta oscuro.", en: "C · Soft, with lavender tones and deep-violet contrast." } },
] as const;
