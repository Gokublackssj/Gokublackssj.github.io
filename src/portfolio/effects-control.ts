import { chooseMotion, storedChoice } from "../scripts/motion-preference";
import { setMaterial } from "./liquid-glass";
import { createLabScope } from "./lifecycle";

const KEY = "luisdataworks:lab:effects";
let owned: ReturnType<typeof createLabScope> | undefined;

export function initEffectsControl() {
  if (owned && !owned.disposed) return;
  const button = document.querySelector<HTMLButtonElement>("[data-effects-control]");
  if (!button) return;
  const scope = createLabScope(); owned = scope;
  const root = document.documentElement;
  const contrast = matchMedia("(prefers-contrast: more)");
  const forced = matchMedia("(forced-colors: active)");
  let full = false;
  try { full = localStorage.getItem(KEY) === "full" && storedChoice() === "on"; } catch {}
  const paint = () => {
    root.toggleAttribute("data-effects-full", full);
    root.toggleAttribute("data-ignore-rt", full);
    button.setAttribute("aria-pressed", String(full));
    button.textContent = (full ? button.dataset.full : button.dataset.system)!;
    button.title = (full ? button.dataset.reset : button.dataset.enable)!;
    setMaterial(contrast.matches || forced.matches ? "css" : full ? "clear" : "lens");
  };
  const save = () => {
    try { if (full) localStorage.setItem(KEY, "full"); else localStorage.removeItem(KEY); } catch {}
  };
  scope.listen(button, "click", () => {
    full = !full;
    // This is the existing site's preference, not a second motion store.
    chooseMotion(full ? "on" : "system");
    save();
    paint();
  });
  scope.listen(document, "motionsettingchange", () => {
    if (full && storedChoice() !== "on") { full = false; save(); }
    paint();
  });
  scope.listen(window, "storage", event => {
    const key = (event as StorageEvent).key;
    if (key !== KEY && key !== "luisdataworks:motion") return;
    let motion: "on" | "off" | "system" = "system";
    try {
      // Ignore superseded events from a rapid change in another tab. Read the
      // actual value: storedChoice's page-local fallback may still be "on"
      // when another tab removed the key to return to the system.
      if ((event as StorageEvent).newValue !== localStorage.getItem(key)) return;
      const value = localStorage.getItem("luisdataworks:motion");
      if (value === "on" || value === "off") motion = value;
      full = localStorage.getItem(KEY) === "full" && motion === "on";
    } catch { full = false; }
    if (key === "luisdataworks:motion" && motion !== "on") save();
    // Synchronize the shared module too when another tab changed the choice.
    chooseMotion(motion);
    paint();
  });
  scope.listen(contrast, "change", paint);
  scope.listen(forced, "change", paint);
  scope.onDispose(() => { delete root.dataset.effectsFull; delete root.dataset.ignoreRt; });
  if (!full) save();
  paint(); button.hidden = false;
}
