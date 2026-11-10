import { HOME_SECTION, SITE, mailto } from "@/lib/site";
import Pill from "./Pill";

/** A row of fine tick marks that frames the closing band, top and bottom. */
function Ticks() {
  return (
    <div className="lp-ticks" aria-hidden="true">
      <span className="lp-tick lp-tick-left" />
      <span className="lp-tick" />
      <span className="lp-tick lp-tick-right" />
    </div>
  );
}

// The closing statement: one centred line, then the two ways to reach us.
export default function Contact() {
  return (
    <section className="lp-paper lp-closing" id={HOME_SECTION.contact} aria-labelledby="contact-title">
      <Ticks />
      <div className="lp-closing-inner">
        <h2 className="lp-closing-title" id="contact-title">
          Join us.
        </h2>
        <p className="lp-closing-statement">
          {"Build with us, learn with us, or bring us a problem worth solving.".split(" ").map((word, i) => (
            <span key={i}>{word} </span>
          ))}
        </p>
        <p className="lp-small lp-closing-note">Engineers, researchers, designers and students</p>
        <div className="lp-actions lp-actions-center">
          <Pill href={mailto("Hello from the website")} chip>
            {SITE.email}
          </Pill>
          <Pill href={SITE.linkedinUrl} external>
            LinkedIn
          </Pill>
        </div>
      </div>
      <Ticks />
    </section>
  );
}
