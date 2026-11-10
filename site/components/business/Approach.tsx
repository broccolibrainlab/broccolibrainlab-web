import { HOME_SECTION } from "@/lib/site";
import SplitSection from "../SplitSection";

// Our tagline — Observe, Question, Explore — is also how we work, with delivery as the fourth step.
const STEPS = [
  { title: "Observe", text: "We learn how your business works today, with the people who do the work." },
  { title: "Question", text: "We find the real problem worth solving, and agree what success looks like." },
  { title: "Explore", text: "We prototype and test options quickly, so decisions rest on evidence." },
  { title: "Deliver", text: "We build, launch and support the solution, and keep improving it with you." },
];

export default function Approach() {
  return (
    <SplitSection id={HOME_SECTION.approach} eyebrow="How we work" title="From first question to working solution.">
      <ol className="steps" role="list">
        {STEPS.map((step, index) => (
          <li className="step" key={step.title}>
            <span className="step-num" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-text">{step.text}</p>
          </li>
        ))}
      </ol>
    </SplitSection>
  );
}
