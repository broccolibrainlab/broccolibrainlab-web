// The people shown in the Team section on the home page, in this order.
//
// Each entry:
//   name        their full name
//   degree      their degree, shown under the name
//   university  where they study, shown under the degree
//   photo       a file in public/team/ (portrait, 4:5, e.g. 480 × 600 px or larger)
//   linkedin    their LinkedIn profile URL
//   github      their GitHub profile URL
// A link left as PLACEHOLDER_LINK still shows, but goes nowhere: paste the real profile URL over it.
// Entries without a name show as a placeholder card, so the layout is ready before the details are.

export type TeamMember = {
  name?: string;
  degree?: string;
  university?: string;
  photo?: string;
  linkedin?: string;
  github?: string;
};

/** Stands in for a profile link until the real URL is pasted in. */
export const PLACEHOLDER_LINK = "#";

const AI_DEGREE = {
  degree: "BSc (Hons) in Artificial Intelligence",
  university: "University of Moratuwa, Sri Lanka",
};

export const TEAM: readonly TeamMember[] = [
  {
    name: "Vihanga Sathsara",
    ...AI_DEGREE,
    photo: "vihanga-sathsara.jpg",
    linkedin: "https://www.linkedin.com/in/vihangasathsara/",
    github: "https://github.com/vihangasath",
  },
  {
    name: "JV Ransika",
    ...AI_DEGREE,
    photo: "jv-ransika.jpg",
    linkedin: "https://www.linkedin.com/in/j-v-ransika/",
    github: "https://github.com/jv-ransika",
  },
  {
    name: "Tharusha Udana",
    ...AI_DEGREE,
    photo: "tharusha.jpg",
    linkedin: "https://www.linkedin.com/in/tharushaudana/",
    github: PLACEHOLDER_LINK, // paste GitHub URL
  },
  {
    name: "Sandaru Ariyarathna",
    ...AI_DEGREE,
    photo: "sandaru-ariyarathna.jpg",
    linkedin: "https://www.linkedin.com/in/sandaruariyaratne/",
    github: "https://github.com/sandaruariyaratne",
  },
];

/** Public URL of a photo in public/team/, including the base path when the site is built with one. */
export const teamPhoto = (file: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/team/${file}`;
