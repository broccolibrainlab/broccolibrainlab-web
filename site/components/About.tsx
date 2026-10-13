import { SECTION, SITE } from "@/lib/site";
import LogoMark from "./LogoMark";
import SplitSection from "./SplitSection";

export default function About() {
  return (
    <SplitSection id={SECTION.about} eyebrow="About the group" title="Students learning about the brain, together.">
      <p className="prose-lead">
        {SITE.name} is a group of undergraduate students curious about the human brain. We’re learning about
        cognition, memory and EEG together.
      </p>
      <p className="prose">
        We read cognitive neuroscience and mindfulness material, take part in EEG signal-processing competitions, and
        are designing research with a professor. Our direction is still open — we’re exploring, and shaping it as we
        learn.
      </p>

      <div className="name-note">
        <LogoMark size={40} />
        <p>
          <strong>Why broccoli?</strong> We chose the name because a head of broccoli, with its branching florets,
          resembles a brain.
        </p>
      </div>

      {/* Placeholder until real member details are supplied — do not invent profiles. */}
      <div className="team-note" id="team">
        <h3 className="minor-title">The team</h3>
        <p className="prose">
          We’re a small group of undergraduates. Individual member introductions will be added here soon.
        </p>
      </div>
    </SplitSection>
  );
}
