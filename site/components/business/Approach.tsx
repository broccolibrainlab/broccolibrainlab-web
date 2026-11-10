import { BUSINESS_SECTION, anchor } from "@/lib/site";
import LpProcess from "../landing/LpProcess";
import Pill from "../landing/Pill";
import Industries from "./Industries";

// Our tagline — Observe, Question, Explore — is also how we work, with delivery as the fourth step.
const STEPS = [
  { title: "Observe", text: "Learn how your business works today." },
  { title: "Question", text: "Agree on the real problem to solve." },
  { title: "Explore", text: "Prototype and test options quickly." },
  { title: "Deliver", text: "Build, launch and keep improving." },
];

export default function Approach() {
  return (
    <LpProcess
      id={BUSINESS_SECTION.approach}
      aside={<Industries />}
      title="How we work"
      lede="Four steps from first conversation to a working solution, with you involved at every one."
      steps={STEPS}
      action={
        <Pill href={anchor(BUSINESS_SECTION.contact)} variant="dark">
          Start a project
        </Pill>
      }
    />
  );
}
