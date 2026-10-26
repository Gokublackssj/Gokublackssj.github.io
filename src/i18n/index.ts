import { en, type Dict } from "./en";
import { es } from "./es";

export type Lang = "en" | "es";

export const dicts: Record<Lang, Dict> = { en, es };

export const paths: Record<Lang, string> = { en: "/", es: "/es/" };

export const langNames: Record<Lang, string> = { en: "English", es: "Español" };

export type { Dict };
