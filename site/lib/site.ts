// Single source of truth for site-wide content, routes and navigation.

export const SITE = {
  name: "Broccoli Brain Lab",
  tagline: "Observe, Question, Explore",
  description:
    "Broccoli Brain Lab is where people from different fields connect to build better solutions for the world — in business, neuroscience and gaming.",
  linkedinUrl: "https://www.linkedin.com/company/116784298/",
  email: "info@broccolibrain.net",
} as const;

/** A mailto: link to our inbox; opens the visitor's own mail app with the subject filled in. */
export const mailto = (subject?: string) =>
  `mailto:${SITE.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

/** Routes. Trailing slashes match `trailingSlash: true` in next.config.ts. */
export const PAGE = {
  home: "/",
  business: "/business/",
  neuroscience: "/neuroscience/",
  neuroResources: "/neuroscience/resources/",
  saliency: "/neuroscience/resources/saliency/",
  gaming: "/gaming/",
} as const;

/** Palettes, matching the data-page-theme blocks at the top of app/globals.css. */
export type Theme = "home" | "business" | "neuro" | "gaming";

/** Each page's --bg, used for the browser's theme-color. Every page shares the charcoal-and-sage palette. */
export const THEME_COLOR: Record<Theme, string> = {
  home: "#141815",
  business: "#141815",
  neuro: "#141815",
  gaming: "#141815",
};

/** In-page section ids, per page. Nav links, CTAs and the sections themselves all read from here. */
export const HOME_SECTION = {
  about: "about",
  focus: "focus-areas",
  how: "how-it-works",
  team: "team",
  contact: "contact",
} as const;

export const BUSINESS_SECTION = {
  services: "services",
  industries: "industries",
  approach: "approach",
  contact: "contact",
} as const;

export const NEURO_SECTION = {
  exploring: "exploring",
  research: "research",
  about: "about",
  notes: "notes",
  contact: "contact",
} as const;

export const GAMING_SECTION = {
  play: "play",
  exploring: "exploring",
  contact: "contact",
} as const;

export const anchor = (id: string) => `#${id}`;

/** A link to a section of a page: `/neuroscience/#about`. Rendered as a plain `#about` on that page itself. */
export const sectionHref = (page: string, id: string) => `${page}${anchor(id)}`;

/** The "Focus areas": where the people who connect here build, research and play. */
export type Area = {
  key: Exclude<Theme, "home">;
  label: string;
  href: string;
  summary: string;
};

export const AREAS: readonly Area[] = [
  {
    key: "business",
    label: "Business Solutions",
    href: PAGE.business,
    summary: "Software, data and automation for organisations across industries.",
  },
  {
    key: "neuro",
    label: "Neuroscience Lab",
    href: PAGE.neuroscience,
    summary: "Student-led learning about cognition, memory and EEG.",
  },
  {
    key: "gaming",
    label: "Gaming",
    href: PAGE.gaming,
    summary: "Games we design and build, and what they teach us.",
  },
];

export type NavLinkItem = { label: string; href: string };
export type NavItem = NavLinkItem | { label: string; areas: readonly Area[] };

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "About", href: sectionHref(PAGE.home, HOME_SECTION.about) },
  { label: "Focus areas", areas: AREAS },
  { label: "How it works", href: sectionHref(PAGE.home, HOME_SECTION.how) },
  { label: "Team", href: sectionHref(PAGE.home, HOME_SECTION.team) },
  { label: "Contact", href: sectionHref(PAGE.home, HOME_SECTION.contact) },
];

/** The secondary bar shown on each focus-area page. */
export const AREA_NAV: Record<Area["key"], readonly NavLinkItem[]> = {
  business: [
    { label: "Services", href: sectionHref(PAGE.business, BUSINESS_SECTION.services) },
    { label: "Industries", href: sectionHref(PAGE.business, BUSINESS_SECTION.industries) },
    { label: "Approach", href: sectionHref(PAGE.business, BUSINESS_SECTION.approach) },
    { label: "Contact", href: sectionHref(PAGE.business, BUSINESS_SECTION.contact) },
  ],
  neuro: [
    { label: "Exploring", href: sectionHref(PAGE.neuroscience, NEURO_SECTION.exploring) },
    { label: "Research", href: sectionHref(PAGE.neuroscience, NEURO_SECTION.research) },
    { label: "About", href: sectionHref(PAGE.neuroscience, NEURO_SECTION.about) },
    { label: "Notes", href: sectionHref(PAGE.neuroscience, NEURO_SECTION.notes) },
    { label: "Resources", href: PAGE.neuroResources },
    { label: "Contact", href: sectionHref(PAGE.neuroscience, NEURO_SECTION.contact) },
  ],
  gaming: [
    { label: "Play", href: sectionHref(PAGE.gaming, GAMING_SECTION.play) },
    { label: "Exploring", href: sectionHref(PAGE.gaming, GAMING_SECTION.exploring) },
    { label: "Contact", href: sectionHref(PAGE.gaming, GAMING_SECTION.contact) },
  ],
};

/** Must match the `@media (max-width: 820px)` mobile-nav breakpoint in app/globals.css. */
export const MOBILE_NAV_QUERY = "(max-width: 820px)";
