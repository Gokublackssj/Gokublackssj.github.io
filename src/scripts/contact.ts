// The contact form: it prepares an email with the chosen service, or copies
// the same message. Nothing is sent from the page and no service is involved:
// the visitor's own email app sends it.
//
// The package buttons ("I want a site like this") and the concept demos link
// to `?plan=<id>#contact`. On load, that id chooses the matching service; on
// this same page, the click chooses it without reloading.

import { motionAllowed } from "./motion-preference";

export function initContact() {
  const form = document.querySelector<HTMLFormElement>("[data-composer]");
  if (!form) return;
  const service = form.querySelector<HTMLSelectElement>("#composer-service")!;
  const name = form.querySelector<HTMLInputElement>("#composer-name")!;
  const message = form.querySelector<HTMLTextAreaElement>("#composer-message")!;
  const error = form.querySelector<HTMLElement>("#composer-message-error")!;
  const status = form.querySelector<HTMLElement>("[data-status]")!;
  const copy = form.querySelector<HTMLButtonElement>("[data-copy]")!;
  const previewWrap = form.querySelector<HTMLElement>("[data-preview-wrap]")!;
  const preview = form.querySelector<HTMLTextAreaElement>("[data-preview]")!;
  const d = form.dataset;
  // With this script the form checks itself and says what is missing next to
  // the field; without it, the browser's own check of `required` applies.
  form.noValidate = true;

  const choose = (plan: string | null) => {
    if (!plan) return false;
    const option = [...service.options].find((o) => o.dataset.plan === plan);
    if (option) service.value = option.value;
    return !!option;
  };

  // Arriving from a package button or a demo.
  choose(new URLSearchParams(location.search).get("plan"));

  // A package button on this page: choose it and go to the form, no reload.
  document.addEventListener("click", (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-plan]");
    if (!link || link.pathname !== location.pathname) return;
    if (!choose(link.dataset.plan ?? null)) return;
    event.preventDefault();
    history.replaceState(null, "", `?plan=${link.dataset.plan}#contact`);
    form.scrollIntoView({ behavior: motionAllowed() ? "smooth" : "auto", block: "start" });
    message.focus({ preventScroll: true });
  });

  const valid = () => {
    const ok = message.value.trim().length > 0;
    error.hidden = ok;
    message.setAttribute("aria-invalid", String(!ok));
    if (!ok) message.focus();
    return ok;
  };

  message.addEventListener("input", () => {
    if (message.value.trim()) {
      error.hidden = true;
      message.removeAttribute("aria-invalid");
    }
  });

  const compose = () => {
    const label = service.value;
    const lines = [`${d.bodyService}: ${label}`];
    if (name.value.trim()) lines.push(`${d.bodyName}: ${name.value.trim()}`);
    lines.push("", message.value.trim());
    return { subject: `${d.subject}: ${label}`, body: lines.join("\n") };
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!valid()) return;
    const { subject, body } = compose();
    status.textContent = d.opened ?? "";
    location.href = `mailto:${d.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  // Copying needs a script, so the button only appears with one.
  copy.hidden = false;
  copy.addEventListener("click", async () => {
    if (!valid()) return;
    const { subject, body } = compose();
    const text = `${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
      previewWrap.hidden = true;
      status.textContent = d.copied ?? "";
    } catch {
      // No clipboard access: show the message, selected, to copy by hand.
      preview.value = text;
      previewWrap.hidden = false;
      preview.focus();
      preview.select();
      status.textContent = d.copyFailed ?? "";
    }
  });
}
