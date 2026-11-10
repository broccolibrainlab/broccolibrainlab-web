import { GAMING_SECTION } from "@/lib/site";
import ContactDetails from "../ContactDetails";
import SplitSection from "../SplitSection";

export default function Contact() {
  return (
    <SplitSection id={GAMING_SECTION.contact} title="Want to playtest?">
      <p className="prose-lead">Try early builds and tell us what you think.</p>
      <ContactDetails subject="Playtesting" />
    </SplitSection>
  );
}
