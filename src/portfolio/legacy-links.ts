// Fixed, same-origin destinations preserve historic fragments and enquiry context.
import {legacyFragments} from "./legacy-fragments";
import {legacyHref} from "../data/routes";
const known=new Set<string>([...legacyFragments,"services","services-title","process","process-title","about","about-title","contact","contact-title"]);
function routeLegacyHash(){
  const id=location.hash.slice(1);
  const anchor=document.getElementById(id);
  if(anchor){
    let parent=anchor.parentElement;
    let expanded=false;
    while(parent){if(parent instanceof HTMLDetailsElement&&!parent.open){parent.open=true;expanded=true;}parent=parent.parentElement;}
    if(expanded)requestAnimationFrame(()=>anchor.scrollIntoView({block:"start"}));
  }
  if(!known.has(id)) return;
  // Home owns its current sections. All other historic documentation anchors
  // resolve to the same content's individual page.
  if(document.querySelector(".pf-hero") && document.getElementById(id) && ![...legacyFragments].some(fragment=>fragment===id)) return;
  const target=new URL(legacyHref(document.documentElement.lang==="es"?"es":"en",id),location.origin);
  if(target.pathname===location.pathname) return;
  target.search=location.search;
  location.replace(target.href);
}
routeLegacyHash();window.addEventListener("hashchange",routeLegacyHash);
