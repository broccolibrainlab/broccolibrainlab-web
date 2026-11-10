export type Step = { title: string; text: string };

type LpProcessProps = {
  id: string;
  /** The left half: a panel such as the team or the industries (see LpAside). */
  aside: React.ReactNode;
  title: string;
  lede: string;
  steps: readonly Step[];
  action?: React.ReactNode;
};

// Half charcoal panel, half deep green: the steps as numbered circles on one connected line.
export default function LpProcess({ id, aside, title, lede, steps, action }: LpProcessProps) {
  const titleId = `${id}-title`;
  return (
    <section className="lp-process" id={id} aria-labelledby={titleId}>
      {aside}

      <div className="lp-process-body">
        <h2 className="lp-big" id={titleId}>
          {title}
        </h2>
        <p className="lp-big lp-process-lede">{lede}</p>

        <ol className="lp-steps" role="list">
          {steps.map((step, index) => (
            <li className="lp-step" key={step.title}>
              <span className="lp-step-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="lp-step-copy">
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </p>
            </li>
          ))}
        </ol>

        {action && <div className="lp-actions lp-process-actions">{action}</div>}
      </div>
    </section>
  );
}

type LpAsideProps = {
  id: string;
  title: string;
  lede: string;
  children: React.ReactNode;
};

/** The charcoal left half of an LpProcess band, with its own heading. */
export function LpAside({ id, title, lede, children }: LpAsideProps) {
  const titleId = `${id}-title`;
  return (
    <section className="lp-aside" id={id} aria-labelledby={titleId}>
      <h2 className="lp-big" id={titleId}>
        {title}
      </h2>
      <p className="lp-big lp-aside-lede">{lede}</p>
      {children}
    </section>
  );
}
