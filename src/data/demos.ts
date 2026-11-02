import type { ImageMetadata } from "astro";
import type { Lang } from "../i18n";
import hervorDesktop from "../assets/shots/demos/hervor-desktop.jpg";
import hervorMobile from "../assets/shots/demos/hervor-mobile.jpg";
import aureaDesktop from "../assets/shots/demos/aurea-desktop.jpg";
import aureaMobile from "../assets/shots/demos/aurea-mobile.jpg";

// Concept demos of the website packages. Each demo is its own site, in its own
// repository with its own configuration and publishing; the portfolio keeps
// only what its card needs.
//
// A demo starts as "planned": the Services section lists it as in progress,
// with its package and kind of business only (src/i18n, demos), and
// no picture, video or link. Once it is built and published, its entry becomes
// "published", with:
//   - the published address (and its repository, when public);
//   - a real screenshot of the published site, for desktop and for mobile, in
//     src/assets/shots/demos/ (shown as is, or as the poster of a recording);
//   - optionally, a short muted preview recorded from the published site, as
//     WebM and MP4 in public/media/demos/<id>/;
//   - the card's text in both languages.
// Every demo is a concept for a fictional business, and the card says so.

export const packageIds = ["essential", "professional", "signature"] as const;
export type PackageId = (typeof packageIds)[number];

export type DemoMedia = {
  /** A real screenshot of the published site: shown as is, or as the recording's poster. */
  poster: ImageMetadata;
  /** Optional recording, paths under public/, e.g. "/media/demos/cafe/desktop.webm". */
  webm?: string;
  mp4?: string;
};

export type PublishedDemo = {
  status: "published";
  package: PackageId;
  id: string;
  /** The published demo. */
  url: string;
  /** Its repository, when public. */
  repo?: string;
  media: { desktop: DemoMedia; mobile: DemoMedia };
  copy: Record<
    Lang,
    {
      /** The fictional business's name. */
      name: string;
      goal: string;
      features: string[];
      /** What the preview shows, for people who cannot see it. */
      alt: string;
    }
  >;
};

export type PlannedDemo = { status: "planned"; package: PackageId };

export type Demo = PublishedDemo | PlannedDemo;

// Essential and Professional are published; Signature is a future demo and
// has not been built.
export const demos: Demo[] = [
  {
    status: "published",
    package: "essential",
    id: "hervor",
    url: "https://gokublackssj.github.io/hervor-essential/",
    repo: "https://github.com/Gokublackssj/hervor-essential",
    media: { desktop: { poster: hervorDesktop }, mobile: { poster: hervorMobile } },
    copy: {
      en: {
        name: "Hervor, high-altitude coffee",
        goal: "A one-page website for a fictional café in Potosí: fast, clear and easy to use on a phone, with everything a customer looks for before visiting.",
        features: [
          "Menu in accessible tabs: photo, items and prices by category",
          "“Open now / Closed”, worked out from the opening hours in Bolivian time",
          "Gallery with a viewer: arrows, swipe and Escape to close",
          "Four-step table booking that prepares the message without sending data",
          "Static site: no server, cookies or analytics; works without JavaScript",
        ],
        alt: "Hervor's home page: an espresso pouring into a glass beside the headline “Espresso at four thousand metres” and a temperature of 87 °C.",
      },
      es: {
        name: "Hervor, café de altura",
        goal: "Una web de una sola página para una cafetería ficticia de Potosí: rápida, clara y fácil de usar en el móvil, con todo lo que un cliente busca antes de ir.",
        features: [
          "Carta en pestañas accesibles: foto, productos y precios por categoría",
          "«Abierto ahora / Cerrado», calculado con el horario y la hora de Bolivia",
          "Galería con visor: flechas, deslizar con el dedo y cierre con Escape",
          "Reserva en cuatro pasos que prepara el mensaje, sin enviar datos",
          "Sitio estático: sin servidor, sin cookies ni analítica; funciona sin JavaScript",
        ],
        alt: "Portada de Hervor: un espresso cayendo en un vaso junto al titular «Espresso a cuatro mil metros» y la temperatura de 87 °C.",
      },
    },
  },
  {
    status: "published",
    package: "professional",
    id: "aurea",
    url: "https://gokublackssj.github.io/aurea-professional/",
    repo: "https://github.com/Gokublackssj/aurea-professional",
    media: { desktop: { poster: aureaDesktop }, mobile: { poster: aureaMobile } },
    copy: {
      en: {
        name: "Aurea, a hotel on Cabo Lumbre",
        goal: "The website of a fictional boutique hotel on the Atlantic: multi-page editorial design with scroll-linked animation, room galleries and a demo booking flow.",
        features: [
          "Custom editorial design: Fraunces and Manrope type, an ivory, night and brass palette",
          "GSAP animation linked to scrolling, without taking over the scroll",
          "Room explorer, galleries and a full-screen viewer",
          "Five-step demo booking, with validation at each step",
          "Reduced-motion mode, keyboard and screen reader support; tested at 1440, 390 and 320 px",
          "AVIF and WebP images per screen size; the video loads only when it comes into view",
        ],
        alt: "Aurea's home page: a basalt headland above the sea at sunset, with the hotel's name and the line “Twenty-two rooms on a basalt headland”.",
      },
      es: {
        name: "Aurea, hotel en Cabo Lumbre",
        goal: "La web de un hotel boutique ficticio frente al Atlántico: diseño editorial en varias páginas, con animaciones ligadas al scroll, galerías por habitación y una reserva de demostración.",
        features: [
          "Diseño editorial propio: tipografía Fraunces y Manrope, paleta marfil, noche y latón",
          "Animaciones con GSAP ligadas al scroll, sin bloquear el desplazamiento",
          "Explorador de habitaciones, galerías y visor a pantalla completa",
          "Reserva de demostración en cinco pasos, con validación en cada uno",
          "Modo de movimiento reducido, teclado y lector de pantalla; probado a 1440, 390 y 320 px",
          "Imágenes AVIF y WebP por tamaño; el vídeo solo se carga al verlo",
        ],
        alt: "Portada de Aurea: un cabo de basalto sobre el mar al atardecer, con el nombre del hotel y la frase «Veintidós habitaciones sobre un cabo de basalto».",
      },
    },
  },
  { status: "planned", package: "signature" },
];

export const isPublished = (demo: Demo): demo is PublishedDemo => demo.status === "published";
