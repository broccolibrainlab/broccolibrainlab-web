import { HOME_SECTION } from "@/lib/site";
import ContactDetails from "../ContactDetails";
import SplitSection from "../SplitSection";

export default function Contact() {
  return (
    <SplitSection id={HOME_SECTION.contact} eyebrow="Contact" title="Let’s talk about your problem.">
      <p className="prose-lead">
        Tell us what you’re trying to solve. We’ll listen first, and tell you honestly whether we can help.
      </p>
      <ContactDetails subject="Project enquiry" />
    </SplitSection>
  );
}
