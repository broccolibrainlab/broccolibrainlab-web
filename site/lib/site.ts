// Single source of truth for site-wide content, routes and navigation.

export const SITE = {
  name: "Broccoli Brain Lab",
  tagline: "Observe, Question, Explore",
  description:
    "Broccoli Brain Lab designs and builds practical digital solutions — software, data and automation — for organisations across industries, from tourism and agriculture to transport, healthcare and technology.",
  linkedinUrl: "https://www.linkedin.com/company/116784298/",
  email: "info@broccolibrain.net",
} as const;

/** A mailto: link to our inbox; opens the visitor's own mail app with the subject filled in. */
export const mailto = (subject?: string) =>
  `mailto:${SITE.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

/** Routes. Trailing slashes match `trailingSlash: true` in next.config.ts. */
export const PAGE = {
  home: "/",
  neuroscience: "/neuroscience/",
  neuroResources: "/neuroscience/resources/",
  saliency: "/neuroscience/resources/saliency/",
  gaming: "/gaming/",
} as const;

/** Palettes, matching the data-page-theme blocks at the top of app/globals.css. */
export type Theme = "business" | "neuro" | "gaming";

/** Each palette's --bg, used for the browser's theme-color. */
export const THEME_COLOR: Record<Theme, string> = {
  business: "#161512",
  neuro: "#141815",
  gaming: "#15141c",
};

/** In-page section ids, per page. Nav links, CTAs and the sections themselves all read from here. */
export const HOME_SECTION = {
  services: "services",
  interests: "interests",
  industries: "industries",
  approach: "approach",
  team: "team",
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

/** The "Interested areas": what we're learning about alongside client work. */
export type Area = {
  key: Exclude<Theme, "business">;
  label: string;
  href: string;
  summary: string;
};

export const AREAS: readonly Area[] = [
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
  { label: "Services", href: sectionHref(PAGE.home, HOME_SECTION.services) },
  { label: "Industries", href: sectionHref(PAGE.home, HOME_SECTION.industries) },
  { label: "Approach", href: sectionHref(PAGE.home, HOME_SECTION.approach) },
  { label: "Team", href: sectionHref(PAGE.home, HOME_SECTION.team) },
  { label: "Interested areas", areas: AREAS },
  { label: "Contact", href: sectionHref(PAGE.home, HOME_SECTION.contact) },
];

/** The secondary bar shown on each interested-area page. */
export const AREA_NAV: Record<Area["key"], readonly NavLinkItem[]> = {
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
