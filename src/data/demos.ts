import type { ImageMetadata } from "astro";
import type { Lang } from "../i18n";

// Concept demos of the website packages. Each demo is its own site, in its own
// repository with its own configuration and publishing; the portfolio keeps
// only what its card needs.
//
// A demo starts as "planned": the Services section lists it as in progress,
// with its package and kind of business only (src/i18n, demos), and
// no picture, video or link. Once it is built and published, its entry becomes
// "published", with:
//   - the published address (and its repository, when public);
//   - a short muted preview recorded from the published site, for desktop and
//     for mobile, as WebM and MP4 in public/media/demos/<id>/;
//   - a real screenshot of each as the poster and static fallback, in
//     src/assets/shots/demos/;
//   - the card's text in both languages.
// Every demo is a concept for a fictional business, and the card says so.

export const packageIds = ["essential", "professional", "signature"] as const;
export type PackageId = (typeof packageIds)[number];

export type DemoMedia = {
  /** Paths under public/, e.g. "/media/demos/cafe/desktop.webm". */
  webm: string;
  mp4: string;
  /** A real screenshot of the published site: the poster and the static fallback. */
  poster: ImageMetadata;
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

// None is published yet. Essential (a café) is the first to be built.
export const demos: Demo[] = [
  { status: "planned", package: "essential" },
  { status: "planned", package: "professional" },
  { status: "planned", package: "signature" },
];

export const isPublished = (demo: Demo): demo is PublishedDemo => demo.status === "published";
