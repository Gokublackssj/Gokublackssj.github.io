import type { Lang } from "../i18n";
export const projectIds = ["quoteflow", "leadflow", "book-extractor"] as const;
export type ProjectSlug = typeof projectIds[number];
export const localizedPath = (lang:Lang, path:string) => lang === "es" ? `/es${path}` : path;
export function languagePair(path:string) {
  const neutral=path.replace(/^\/es(?=\/)/, "");
  return {en:neutral, es:`/es${neutral}`};
}
export function legacyHref(lang:Lang, id:string) {
  let path="/projects/";
  const project=projectIds.find(slug => id===slug || id===`${slug}-title`);
  if (project) path=`/projects/${project}/`;
  else if (/^(web|web-title|demos-title|demo-hervor|demo-aurea|site-portfolio)$/.test(id)) path="/projects/websites/";
  else if (/^(services|services-title|plans-title|data-services-title|service-|process|process-title|faq|faq-title|tools-title)/.test(id)) path="/services/";
  else if (/^(contact|contact-title|about|about-title|motion-label|motion-state)$/.test(id)) path="/";
  return `${localizedPath(lang,path)}#${id === "motion-label" || id === "motion-state" ? "contact" : id}`;
}
