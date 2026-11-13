import {refreshLiquidGlass} from "../portfolio/liquid-glass";
import {motionAllowed} from "./motion-preference";
import {createLabScope} from "../portfolio/lifecycle";
// Native horizontal scroll keeps touch, vertical page scroll and no-JS usable.
// This controller only adds position, buttons and keyboard shortcuts.
export function initCompactGalleries(){
  document.querySelectorAll<HTMLElement>("[data-compact-gallery]").forEach(gallery=>{
    if(gallery.dataset.ready)return;
    const scope=createLabScope();gallery.dataset.ready="true";
    const track=gallery.querySelector<HTMLElement>("[data-gallery-track]")!;
    const slides=[...gallery.querySelectorAll<HTMLElement>("[data-gallery-slide]")];
    const prev=gallery.querySelector<HTMLButtonElement>("[data-gallery-prev]")!;
    const next=gallery.querySelector<HTMLButtonElement>("[data-gallery-next]")!;
    const position=gallery.querySelector<HTMLOutputElement>("[data-gallery-position]")!;
    const controls=gallery.querySelector<HTMLElement>("[data-gallery-controls]")!;
    controls.hidden=slides.length<2;
    const expand=gallery.querySelector<HTMLButtonElement>("[data-gallery-expand]")!;
    expand.hidden=false;
    let index=0,frame=0;
    const update=()=>{
      const oldIndex=index;
      const x=track.getBoundingClientRect().left;
      index=slides.reduce((best,slide,i)=>Math.abs(slide.getBoundingClientRect().left-x)<Math.abs(slides[best]!.getBoundingClientRect().left-x)?i:best,0);
      if(index!==oldIndex)refreshLiquidGlass();
      prev.disabled=index===0;next.disabled=index===slides.length-1;
      position.value=`${index+1} / ${slides.length}`;
      slides.forEach((slide,i)=>{slide.querySelector<HTMLAnchorElement>("a")!.tabIndex=i===index?0:-1;});
    };
    const select=(i:number)=>{
      const target=Math.max(0,Math.min(slides.length-1,i));
      const focusImage=slides.some(slide=>slide.contains(document.activeElement));
      track.scrollTo({left:slides[target]!.offsetLeft-slides[0]!.offsetLeft,behavior:motionAllowed()?"smooth":"instant"});
      // Preserve keyboard focus when navigation starts on the image link.
      if(focusImage)slides[target]!.querySelector<HTMLAnchorElement>("a")!.focus({preventScroll:true});
    };
    scope.listen(expand,"click",()=>slides[index]!.querySelector<HTMLAnchorElement>("a")!.click());
    scope.listen(track,"load",()=>refreshLiquidGlass(),{capture:true});
    scope.listen(prev,"click",()=>select(index-1));scope.listen(next,"click",()=>select(index+1));
    scope.listen(track,"keydown",event=>{
      const e=event as KeyboardEvent;
      if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key)||e.altKey||e.ctrlKey||e.metaKey)return;
      e.preventDefault();select(e.key==="Home"?0:e.key==="End"?slides.length-1:index+(e.key==="ArrowLeft"?-1:1));
    });
    scope.listen(track,"scroll",()=>{if(!frame)frame=scope.frame(()=>{frame=0;update();});},{passive:true});
    scope.observe(new ResizeObserver(update)).observe(track);
    scope.onDispose(()=>{delete gallery.dataset.ready;controls.hidden=true;expand.hidden=true;slides.forEach(slide=>slide.querySelector("a")!.removeAttribute("tabindex"));});
    update();
  });
}
