import { GAMING_SECTION } from "@/lib/site";

// The featured game. Until it's added, the stage shows a placeholder at the size the game will take.
// To add it: render the game (or an <iframe> of its build) inside .game-stage.
export default function Play() {
  return (
    <section className="research play" id={GAMING_SECTION.play} aria-labelledby="play-title">
      <div className="container">
        <h2 className="exploring-title" id="play-title">
          Our first game is on its way.
        </h2>
        <div className="game-stage">
          <p className="game-stage-empty">Coming soon — playable right here, in your browser.</p>
        </div>
      </div>
    </section>
  );
}
