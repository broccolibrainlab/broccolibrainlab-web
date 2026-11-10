export type Figure = { figure: string; label: string; text: string };

type LpIntroProps = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  action?: React.ReactNode;
  figures: readonly Figure[];
};

// A paper band: the story on the left (it stays in view while the figures scroll), figures on the right,
// split by a hairline.
export default function LpIntro({ id, title, paragraphs, action, figures }: LpIntroProps) {
  const titleId = `${id}-title`;
  return (
    <section className="lp-paper lp-intro" id={id} aria-labelledby={titleId}>
      <div className="lp-intro-main">
        <h2 className="lp-big" id={titleId}>
          {title}
        </h2>
        <div className="lp-intro-foot">
          <div className="lp-intro-copy">
            {paragraphs.map((text) => (
              <p className="lp-big" key={text}>
                {text}
              </p>
            ))}
          </div>
          {action && <div className="lp-actions">{action}</div>}
        </div>
      </div>

      <ul className="lp-figures" role="list">
        {figures.map((item) => (
          <li className="lp-figure" key={item.figure}>
            <h3 className="lp-figure-stack">
              <span className="lp-figure-value">{item.figure}</span>
              <span className="lp-figure-label">{item.label}</span>
            </h3>
            <p className="lp-big lp-figure-text">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
