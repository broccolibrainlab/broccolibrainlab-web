import { HOME_SECTION } from "@/lib/site";
import LpClosing from "../landing/LpClosing";

// Only what's true today: who we are, what we work on, and how. (Degree and university: lib/team.ts.)
const DETAILS = [
  {
    title: "Who we are",
    text: "A small group of undergraduates studying Artificial Intelligence at the University of Moratuwa, Sri Lanka.",
  },
  {
    title: "What we do",
    text: "We build software and automation for organisations, design small games to learn how people play, and study how the brain works.",
  },
  {
    title: "How we work",
    text: "Observe, question, explore. We bring the problems we see in our own fields and work on them together.",
  },
];

export default function Contact() {
  return (
    <LpClosing
      id={HOME_SECTION.contact}
      title="Join us."
      statement="Build with us, learn with us, or bring us a problem worth solving."
      note="Engineers, researchers, designers and students"
      details={DETAILS}
      subject="Hello from the website"
    />
  );
}
