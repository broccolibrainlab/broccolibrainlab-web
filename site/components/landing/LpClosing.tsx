import { SITE } from "@/lib/site";
import EmailPill from "./EmailPill";
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

type LpClosingProps = {
  id: string;
  title: string;
  /** One sentence; it inks in word by word as it scrolls into view. */
  statement: string;
  note: string;
  /** Optional short columns under the statement, saying a little more about the group. */
  details?: readonly { title: string; text: string }[];
  /** Subject line for the email button, so we know which page it came from. */
  subject: string;
};

// The closing band of every landing-pattern page: one centred statement, then the two ways to reach us.
export default function LpClosing({ id, title, statement, note, details, subject }: LpClosingProps) {
  const titleId = `${id}-title`;
  return (
    <section className="lp-paper lp-closing" id={id} aria-labelledby={titleId}>
      <Ticks />
      <div className="lp-closing-inner">
        <h2 className="lp-closing-title" id={titleId}>
          {title}
        </h2>
        <p className="lp-closing-statement">
          {statement.split(" ").map((word, i) => (
            <span key={i}>{word} </span>
          ))}
        </p>
        {details && (
          <ul className="lp-closing-details" role="list">
            {details.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        )}
        <p className="lp-small lp-closing-note">{note}</p>
        <div className="lp-actions lp-actions-center">
          <EmailPill subject={subject} />
          <Pill href={SITE.linkedinUrl} external>
            LinkedIn
          </Pill>
        </div>
      </div>
      <Ticks />
    </section>
  );
}
