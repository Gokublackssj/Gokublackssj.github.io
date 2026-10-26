// The "Animations" control in the footer: two buttons (on, reduced) and a note
// saying whether the setting follows the device or the visitor's saved
// choice. It stays hidden until this script runs, so there is never a button
// that does nothing.

import { chooseMotion, currentMotion, onMotionChange, storedChoice, type Motion } from "./motion-preference";

export function initMotionControl() {
  const group = document.querySelector<HTMLElement>("[data-motion-control]");
  if (!group) return;
  const buttons = group.querySelectorAll<HTMLButtonElement>("[data-motion-value]");
  const note = group.querySelector<HTMLElement>("[data-motion-note]");

  const render = () => {
    const now = currentMotion();
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.motionValue === now)));
    if (note) note.textContent = (storedChoice() ? group.dataset.noteSaved : group.dataset.noteSystem) ?? "";
  };

  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      chooseMotion(button.dataset.motionValue as Motion);
      render();
    }),
  );
  onMotionChange(render);
  render();
  group.hidden = false;
}
