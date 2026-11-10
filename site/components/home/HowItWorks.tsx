import { HOME_SECTION, anchor } from "@/lib/site";
import LpProcess from "../landing/LpProcess";
import Pill from "../landing/Pill";
import Team from "./Team";

// Our tagline — Observe, Question, Explore — is how we work together, with building as the fourth step.
const STEPS = [
  { title: "Observe", text: "Spot a problem in your own field." },
  { title: "Question", text: "Look at it together, from every angle." },
  { title: "Explore", text: "Team up to prototype and test ideas." },
  { title: "Build", text: "Turn the best idea into a working solution." },
];

export default function HowItWorks() {
  return (
    <LpProcess
      id={HOME_SECTION.how}
      aside={<Team />}
      title="How we work together"
      lede="Four steps, taken as one team. Each one strengthens the next, turning a question into an idea and an idea into something that works."
      steps={STEPS}
      action={
        <Pill href={anchor(HOME_SECTION.contact)} variant="dark">
          Bring us a problem
        </Pill>
      }
    />
  );
}
