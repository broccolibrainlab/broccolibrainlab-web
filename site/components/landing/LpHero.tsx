// The ring of fine lines over every hero: lines radiate between two ellipses, so the centre stays clear and
// the outer edge stays well inside the hero. It's drawn on a circle that turns a third of a circle on load, inside a group
// that squashes the circle into a tilted ellipse, so the lines travel around the ellipse while its shape and
// size never change (it never reaches the hero's edges, even mid-turn). After that one turn the hero is still.
const RING_CENTRE = [740, 410] as const; // a little above the hero's middle, and slightly right of it
const RING_OUTER = 620; // the ellipse is 620 × 330 at its widest
const RING_SQUASH = 330 / RING_OUTER;
const RING_INNER = 220; // the clear centre: 220 × 117

const RING_LINES = 84;

const RING = Array.from({ length: RING_LINES }, (_, i) => {
  const t = (i / RING_LINES) * Math.PI * 2;
  // Lines stop at slightly different distances, for a softer, uneven outer edge.
  const reach = i % 2 ? 0.88 : i % 3 ? 0.95 : 1;
  const round = (n: number) => Math.round(n * 10) / 10;
  return {
    x1: round(Math.cos(t) * RING_INNER),
    y1: round(Math.sin(t) * RING_INNER),
    x2: round(Math.cos(t) * RING_OUTER * reach),
    y2: round(Math.sin(t) * RING_OUTER * reach),
  };
});

function RingOverlay() {
  const [cx, cy] = RING_CENTRE;
  return (
    <svg className="lp-ring" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <g transform={`translate(${cx} ${cy}) rotate(-14) scale(1 ${RING_SQUASH.toFixed(4)})`}>
        <g className="lp-ring-spin">
          {RING.map((line, i) => (
            <line key={i} {...line} />
          ))}
        </g>
      </g>
    </svg>
  );
}

/** Wraps the line's last word (not its closing punctuation) in <em>, which the CSS sets in the logo's colour. */
function accentLastWord(line: string) {
  const match = line.match(/^(.*\s)?(\S+?)([.,!?;:]*)$/);
  if (!match) return line;
  const [, before = "", word, punctuation] = match;
  return (
    <>
      {before}
      <em>{word}</em>
      {punctuation}
    </>
  );
}

type LpHeroProps = {
  /** The full-bleed picture (a photo). */
  media: React.ReactNode;
  /** Two lines, set large in the bottom-left corner. */
  title: [string, string];
  lede: React.ReactNode;
  /** Pills for the paper panel. */
  actions: React.ReactNode;
  /** Draw the faint ring of lines over the picture. */
  overlay?: boolean;
};

// Every landing-pattern page opens like this: a full-bleed picture, the headline bottom left, a paper panel
// with the call to action bottom right.
export default function LpHero({
  media,
  title,
  lede,
  actions,
  overlay = false,
}: LpHeroProps) {
  return (
    <section className="lp-hero" aria-labelledby="hero-title">
      <div className="lp-hero-media">
        {media}
        {overlay && <RingOverlay />}
        <h1 className="lp-hero-title" id="hero-title">
          <span>{title[0]}</span> <span>{accentLastWord(title[1])}</span>
        </h1>
      </div>

      <div className="lp-hero-panel">
        <p className="lp-big">{lede}</p>
        <div className="lp-actions">{actions}</div>
      </div>
    </section>
  );
}
