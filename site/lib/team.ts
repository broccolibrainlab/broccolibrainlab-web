// The people shown in the Team section on the home page, in this order.
//
// To add someone, fill in their entry:
//   name      their full name
//   role      a short role, e.g. "Software engineer"
//   photo     a file in public/team/, e.g. "jane-perera.jpg" (portrait, 4:5, at least 600 × 750 px)
//   linkedin  optional: their LinkedIn profile URL
// Entries without a name show as a placeholder card, so the layout is ready before the details are.

export type TeamMember = {
  name?: string;
  role?: string;
  photo?: string;
  linkedin?: string;
};

export const TEAM: readonly TeamMember[] = [
  { name: "Vihanga Sathsara", photo: "vihanga-sathsara.jpg" },
  { name: "JV Ransika", photo: "jv-ransika.jpg" },
  { name: "Tharusha Udana", photo: "tharusha.jpg" },
  {},
];

/** Public URL of a photo in public/team/, including the base path when the site is built with one. */
export const teamPhoto = (file: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/team/${file}`;
