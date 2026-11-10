import { BUSINESS_SECTION } from "@/lib/site";
import LpClosing from "../landing/LpClosing";

export default function Contact() {
  return (
    <LpClosing
      id={BUSINESS_SECTION.contact}
      title="Let’s talk about your problem."
      statement="Tell us what you’re trying to solve, and we’ll work it out together."
      note="Tourism, technology, agriculture, healthcare, transport, retail and beyond"
      subject="Project enquiry"
    />
  );
}
