import { SITE, mailto } from "@/lib/site";
import { Arrow, MailIcon } from "./icons";

// Every contact section ends with this: our email address as a button (mailto: opens the visitor's own
// mail app, addressed to us, with `subject` filled in so we know which page they came from) and LinkedIn.
export default function ContactDetails({ subject }: { subject: string }) {
  return (
    <div className="contact-actions">
      <a className="button-primary" href={mailto(subject)}>
        <MailIcon />
        {SITE.email}
      </a>
      <a className="link-underline" href={SITE.linkedinUrl} target="_blank" rel="noopener noreferrer">
        Message us on LinkedIn
        <Arrow direction="external" />
        <span className="visually-hidden">(opens in a new tab)</span>
      </a>
    </div>
  );
}
