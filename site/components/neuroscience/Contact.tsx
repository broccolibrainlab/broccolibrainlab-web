import { NEURO_SECTION } from "@/lib/site";
import ContactDetails from "../ContactDetails";
import SplitSection from "../SplitSection";

export default function Contact() {
  return (
    <SplitSection id={NEURO_SECTION.contact} eyebrow="Contact" title="Say hello.">
      <p className="prose-lead">Follow our progress, or get in touch by email or on LinkedIn.</p>
      <ContactDetails subject="Neuroscience Lab" />
    </SplitSection>
  );
}
