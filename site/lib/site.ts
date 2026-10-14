// Single source of truth for site-wide content and identifiers.

export const SITE = {
  name: "Broccoli Brain Lab",
  tagline: "Observe, Question, Explore",
  description:
    "Broccoli Brain Lab is a student-led group exploring cognition, memory and EEG through research and shared learning.",
  linkedinUrl: "https://www.linkedin.com/company/116784298/",
} as const;

/** In-page section ids. Nav links, CTAs and the sections themselves all read from here. */
export const SECTION = {
  exploring: "exploring",
  research: "research",
  about: "about",
  notes: "notes",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION)[keyof typeof SECTION];

export const anchor = (id: SectionId) => `#${id}`;

/** Routes other than the home page. Trailing slashes match `trailingSlash: true` in next.config.ts. */
export const PAGE = {
  home: "/",
  resources: "/resources/",
} as const;

/** A nav item points either at a home-page section or at a separate page. */
export type NavItem = { label: string } & ({ section: SectionId } | { page: string });

export const NAV_ITEMS: readonly NavItem[] = [
  { section: SECTION.about, label: "About" },
  { section: SECTION.research, label: "Research" },
  { section: SECTION.notes, label: "Notes" },
  { page: PAGE.resources, label: "Resources" },
  { section: SECTION.contact, label: "Contact" },
];

/** Must match the `@media (max-width: 820px)` mobile-nav breakpoint in app/globals.css. */
export const MOBILE_NAV_QUERY = "(max-width: 820px)";
