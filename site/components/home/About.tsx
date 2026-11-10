import { HOME_SECTION, anchor } from "@/lib/site";
import Pill from "./Pill";

const PILLARS = [
  { figure: "Every field", label: "One table", text: "Engineers, researchers, designers and students." },
  { figure: "Real problems", label: "Worked together", text: "We team up across fields on problems that matter." },
  { figure: "Three areas", label: "One lab", text: "Business solutions, neuroscience and gaming." },
  { figure: "The world", label: "Who it is for", text: "Solutions for organisations, science and people." },
];

// A paper band: the story on the left (it stays in view while the figures scroll), figures on the right.
export default function About() {
  return (
    <section className="lp-paper lp-intro" id={HOME_SECTION.about} aria-labelledby="about-title">
      <div className="lp-intro-main">
        <h2 className="lp-big" id="about-title">
          What brings us together
        </h2>
        <div className="lp-intro-foot">
          <div className="lp-intro-copy">
            <p className="lp-big">
              Broccoli Brain Lab is where people from different fields connect to build better solutions for the world.
            </p>
            <p className="lp-big">
              Engineers, researchers, designers and students bring the problems they see in their own work, and we look
              at them together, from every angle.
            </p>
            <p className="lp-big">What comes out is practical: software for organisations, learning about the brain, and games.</p>
          </div>
          <div className="lp-actions">
            <Pill href={anchor(HOME_SECTION.how)}>How we work</Pill>
          </div>
        </div>
      </div>

      <ul className="lp-figures" role="list">
        {PILLARS.map((pillar) => (
          <li className="lp-figure" key={pillar.figure}>
            <h3 className="lp-figure-stack">
              <span className="lp-figure-value">{pillar.figure}</span>
              <span className="lp-figure-label">{pillar.label}</span>
            </h3>
            <p className="lp-big lp-figure-text">{pillar.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
