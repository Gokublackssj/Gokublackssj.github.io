// HTTP cannot see fragments. Keep historic bookmarks working after extraction.
import { legacyFragments } from "./legacy-fragments";
const legacy = new Set<string>(legacyFragments);
function routeLegacyHash() {
  const id = location.hash.slice(1);
  if (!legacy.has(id)) return;
  const target = new URL(document.documentElement.lang === "es" ? "/es/projects/" : "/projects/", location.origin);
  target.search = location.search;
  target.hash = id;
  location.replace(target.href);
}
routeLegacyHash();
window.addEventListener("hashchange", routeLegacyHash);
