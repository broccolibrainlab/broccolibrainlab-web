import { SECTION, SITE } from "@/lib/site";
import { Arrow } from "./icons";
import SplitSection from "./SplitSection";

export default function Contact() {
  return (
    <SplitSection id={SECTION.contact} eyebrow="Contact" title="Say hello.">
      <p className="prose-lead">Follow our progress or get in touch with us on LinkedIn.</p>
      <a className="button-primary" href={SITE.linkedinUrl} target="_blank" rel="noopener noreferrer">
        {SITE.name} on LinkedIn
        <Arrow direction="external" />
        <span className="visually-hidden">(opens in a new tab)</span>
      </a>
    </SplitSection>
  );
}
