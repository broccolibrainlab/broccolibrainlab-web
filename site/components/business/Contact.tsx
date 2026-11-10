import { BUSINESS_SECTION } from "@/lib/site";
import ContactDetails from "../ContactDetails";
import SplitSection from "../SplitSection";

export default function Contact() {
  return (
    <SplitSection id={BUSINESS_SECTION.contact} title="Let’s talk about your problem.">
      <p className="prose-lead">Tell us what you’re trying to solve.</p>
      <ContactDetails subject="Project enquiry" />
    </SplitSection>
  );
}
