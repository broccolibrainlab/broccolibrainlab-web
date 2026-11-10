import { HOME_SECTION, anchor } from "@/lib/site";
import LogoMark from "../LogoMark";
import Pill from "./Pill";

// Our tagline — Observe, Question, Explore — is how we work together, with building as the fourth step.
const STEPS = [
  { title: "Observe", text: "Spot a problem in your own field." },
  { title: "Question", text: "Look at it together, from every angle." },
  { title: "Explore", text: "Team up to prototype and test ideas." },
  { title: "Build", text: "Turn the best idea into a working solution." },
];

// Half emblem, half deep green: the four steps as numbered circles on one connected line.
export default function HowItWorks() {
  return (
    <section className="lp-process" id={HOME_SECTION.how} aria-labelledby="how-title">
      <div className="lp-process-art" aria-hidden="true">
        <svg className="lp-orbits" viewBox="0 0 400 400" focusable="false">
          <circle cx="200" cy="200" r="190" />
          <circle cx="200" cy="200" r="140" />
          <circle cx="200" cy="200" r="90" />
        </svg>
        <LogoMark className="lp-process-mark" size={96} />
      </div>

      <div className="lp-process-body">
        <h2 className="lp-big" id="how-title">
          How we work together
        </h2>
        <p className="lp-big lp-process-lede">
          Four steps, taken as one team. Each one strengthens the next, turning a question into an idea and an idea into
          something that works.
        </p>

        <ol className="lp-steps" role="list">
          {STEPS.map((step, index) => (
            <li className="lp-step" key={step.title}>
              <span className="lp-step-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="lp-step-copy">
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </p>
            </li>
          ))}
        </ol>

        <div className="lp-actions lp-process-actions">
          <Pill href={anchor(HOME_SECTION.contact)} variant="dark">
            Bring us a problem
          </Pill>
        </div>
      </div>
    </section>
  );
}
