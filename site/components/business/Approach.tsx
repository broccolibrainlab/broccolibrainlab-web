import { BUSINESS_SECTION } from "@/lib/site";
import SplitSection from "../SplitSection";

// Our tagline — Observe, Question, Explore — is also how we work, with delivery as the fourth step.
const STEPS = [
  { title: "Observe", text: "Learn how your business works today." },
  { title: "Question", text: "Agree on the real problem to solve." },
  { title: "Explore", text: "Prototype and test options quickly." },
  { title: "Deliver", text: "Build, launch and keep improving." },
];

export default function Approach() {
  return (
    <SplitSection id={BUSINESS_SECTION.approach} title="How we work.">
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
