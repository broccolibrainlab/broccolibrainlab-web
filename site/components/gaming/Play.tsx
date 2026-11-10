import { GAMING_SECTION } from "@/lib/site";

// The featured game. Until it's added, the stage shows a placeholder at the size the game will take.
// To add it: render the game (or an <iframe> of its build) inside .game-stage and fill in FACTS.
const FACTS = [
  { term: "Status", detail: "Being added" },
  { term: "Platform", detail: "Web browser" },
  { term: "Price", detail: "Free to play" },
  { term: "Made by", detail: "Our team" },
];

export default function Play() {
  return (
    <section className="research play" id={GAMING_SECTION.play} aria-labelledby="play-title">
      <div className="container">
        <div className="research-strip">
          <div className="research-heading">
            <p className="eyebrow research-label">Featured game</p>
            <h2 className="research-title" id="play-title">
              Our first game is on its way.
            </h2>
          </div>
        </div>

        <div className="play-body">
          <div className="game-stage">
            <div className="game-stage-empty">
              <p className="game-stage-title">Coming soon</p>
              <p>The game will be playable right here, in your browser.</p>
            </div>
          </div>
          <dl className="facts">
            {FACTS.map((fact) => (
              <div className="fact" key={fact.term}>
                <dt>{fact.term}</dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
