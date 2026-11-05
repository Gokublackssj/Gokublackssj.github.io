import type { Lang } from "../i18n";

// Public links. The email was confirmed by Luis on 2026-10-24.
export const contact = {
  email: "luiscontactojob2007@gmail.com",
  github: "https://github.com/Gokublackssj",
  // Profile URL from the previous portfolio's README.
  upwork: "https://www.upwork.com/freelancers/~01fce0ca0e396f55e8",
  cvPdf: "/cv/Luis_Pimentel_CV.pdf",
  cvDocx: "/cv/Luis_Pimentel_CV.docx",
  // Stable legacy addresses remain available with the current developer CVs.
  cvPdfEs: "/cv/Luis_Pimentel_CV_ES.pdf",
  cvDeveloperEn: "/cv/Luis_Pimentel_CV_Developer_EN.pdf",
  cvDeveloperEs: "/cv/Luis_Pimentel_CV_Desarrollador_ES.pdf",
  cvFreelanceEn: "/cv/Luis_Pimentel_CV_Freelance_EN.pdf",
  cvFreelanceEs: "/cv/Luis_Pimentel_CV_Freelance_ES.pdf",
};

// Every CV action reads this map, so a page cannot accidentally offer the
// other language's document. Legacy addresses stay available for old links.
export const cvByLanguage = {
  en: {
    developer: contact.cvDeveloperEn,
    freelance: contact.cvFreelanceEn,
    developerWord: contact.cvDocx,
  },
  es: {
    developer: contact.cvDeveloperEs,
    freelance: contact.cvFreelanceEs,
    // No verified Spanish Word file is published. Never substitute English.
    developerWord: null,
  },
} satisfies Record<Lang, { developer: string; freelance: string; developerWord: string | null }>;

export const repos = {
  quoteflow: "https://github.com/Gokublackssj/quoteflow",
  leadflow: "https://github.com/Gokublackssj/LeadFlow",
  bookExtractor: "https://github.com/Gokublackssj/book-data-extractor-pro",
};
