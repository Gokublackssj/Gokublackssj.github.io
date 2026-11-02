// The "Animations" control in the footer: three buttons (Device, On, Reduced)
// and a sentence with the setting in effect and where it comes from, for
// example "Animations reduced, following your device setting." It stays
// hidden until this script runs, so there is never a button that does nothing.

import { chooseMotion, currentMotion, onMotionSettingChange, storedChoice, type MotionChoice } from "./motion-preference";

export function initMotionControl() {
  const group = document.querySelector<HTMLElement>("[data-motion-control]");
  if (!group) return;
  const buttons = group.querySelectorAll<HTMLButtonElement>("[data-motion-value]");
  const state = group.querySelector<HTMLElement>("[data-motion-state]");
  const d = group.dataset;

  const render = () => {
    const choice = storedChoice();
    const selected: MotionChoice = choice ?? "system";
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.motionValue === selected)));
    if (state) {
      const effect = currentMotion() === "on" ? d.stateOn : d.stateOff;
      state.textContent = `${effect}, ${choice ? d.fromChoice : d.fromSystem}.`;
    }
  };

  buttons.forEach((button) =>
    button.addEventListener("click", () => chooseMotion(button.dataset.motionValue as MotionChoice)),
  );
  onMotionSettingChange(render);
  render();
  group.hidden = false;
}
