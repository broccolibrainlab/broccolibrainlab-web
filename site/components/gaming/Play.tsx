import { GAMING_SECTION, anchor } from "@/lib/site";
import AreaArt from "../landing/AreaArt";
import Pill from "../landing/Pill";

// The featured game. Until it's added, the stage shows artwork at the size the game will take.
// To add it: render the game (or an <iframe> of its build) inside .lp-stage, in place of the art and note.
export default function Play() {
  return (
    <section className="lp-areas lp-play" id={GAMING_SECTION.play} aria-labelledby="play-title">
      <div className="lp-wrap">
        <div className="lp-head">
          <div>
            <h2 className="lp-big" id="play-title">
              Our first game
            </h2>
            <p className="lp-big lp-head-lede">It’s on its way, and you’ll play it right here, in your browser.</p>
          </div>
          <div className="lp-head-aside">
            <p className="lp-small">Want to try it before anyone else? Early builds go to our playtesters first.</p>
            <Pill href={anchor(GAMING_SECTION.contact)} variant="outline">
              Become a playtester
            </Pill>
          </div>
        </div>

        <div className="lp-stage">
          <AreaArt area="gaming" tone="dark" variant="stage" className="lp-stage-art" />
          <p className="lp-stage-note">Coming soon</p>
        </div>
      </div>
    </section>
  );
}
