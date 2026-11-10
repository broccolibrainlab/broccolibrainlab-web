import { HOME_SECTION, anchor } from "@/lib/site";
import LpIntro from "../landing/LpIntro";
import Pill from "../landing/Pill";

const FIGURES = [
  { figure: "Every field", label: "One table", text: "Engineers, researchers, designers and students." },
  { figure: "Real problems", label: "Worked together", text: "We team up across fields on problems that matter." },
  { figure: "Two areas", label: "One lab", text: "Business solutions and gaming." },
  { figure: "The world", label: "Who it is for", text: "Solutions for organisations and people." },
];

export default function About() {
  return (
    <LpIntro
      id={HOME_SECTION.about}
      title="What brings us together"
      paragraphs={[
        "Broccoli Brain Lab is where people from different fields connect to build better solutions for the world.",
        "Engineers, researchers, designers and students bring the problems they see in their own work, and we look at them together, from every angle.",
        "What comes out is practical: software for organisations, and games that teach us how people play.",
      ]}
      action={<Pill href={anchor(HOME_SECTION.how)}>How we work</Pill>}
      figures={FIGURES}
    />
  );
}
