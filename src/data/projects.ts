import type { ImageMetadata } from "astro";

import siteLight from "../assets/shots/site/home-light.png";
import siteDark from "../assets/shots/site/home-dark.png";

// The Web development category (with the concept demos in src/data/demos.ts).
// Each entry is one finished, published site; its copy
// lives under `websites.<id>` in both language files. To add a site: put its
// screenshots (1440 x 900, one per theme) in src/assets/shots/site/, add an
// entry here and its text in src/i18n/en.ts and es.ts. Only real, finished
// sites go here: the section shows as many as exist.
export type Website = {
  id: "portfolio";
  url: string;
  repo?: string;
  light: ImageMetadata;
  dark: ImageMetadata;
};

export const websites: Website[] = [
  {
    id: "portfolio",
    url: "https://gokublackssj.github.io/",
    repo: "https://github.com/Gokublackssj/Gokublackssj.github.io",
    // Captured from this site's own first screen (English, 1440 x 900).
    light: siteLight,
    dark: siteDark,
  },
];

// The Python, data and automation category: its case studies, in page order
// (src/components/Page.astro renders one per id). The category's count in the
// projects index comes from this list.
export const pythonProjects = ["quoteflow", "leadflow", "book-extractor"] as const;
