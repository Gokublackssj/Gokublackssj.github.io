import type { APIRoute } from "astro";
import { paths } from "../i18n";

export const GET: APIRoute = ({ site }) => {
  const urls = Object.values(paths)
    .map((p) => {
      const alternates = Object.entries(paths)
        .map(([l, href]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${new URL(href, site)}"/>`)
        .join("");
      return `<url><loc>${new URL(p, site)}</loc>${alternates}</url>`;
    })
    .join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
