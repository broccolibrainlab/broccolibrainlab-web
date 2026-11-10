import { GAMING_SECTION } from "@/lib/site";
import ContactDetails from "../ContactDetails";
import SplitSection from "../SplitSection";

export default function Contact() {
  return (
    <SplitSection id={GAMING_SECTION.contact} eyebrow="Contact" title="Want to playtest?">
      <p className="prose-lead">We’re always looking for players to try early builds and tell us what they think.</p>
      <ContactDetails subject="Playtesting" />
    </SplitSection>
  );
}
