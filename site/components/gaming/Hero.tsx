import graph from "@/assets/data/gaming-graph.json";
import type { RawGraph } from "@/lib/brainEngine";
import { GAMING_SECTION, anchor } from "@/lib/site";
import HeroGraph from "../HeroGraph";
import { Arrow } from "../icons";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow eyebrow-rule">Games &amp; play</p>
          <h1 className="hero-title" id="hero-title">
            <span className="hero-line">Made for play,</span>
            <span className="hero-line hero-line-accent">built to learn.</span>
          </h1>
          <p className="hero-lede">
            We design and build small games — to have fun, and to learn how people focus, decide and&nbsp;play.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href={anchor(GAMING_SECTION.play)}>
              Play our game
              <Arrow />
            </a>
            <a className="link-underline" href={anchor(GAMING_SECTION.exploring)}>
              What we explore
            </a>
          </div>
        </div>

        <HeroGraph graph={graph as RawGraph} />
      </div>
    </section>
  );
}
