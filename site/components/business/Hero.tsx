import graph from "@/assets/data/business-graph.json";
import type { RawGraph } from "@/lib/brainEngine";
import { HOME_SECTION, anchor } from "@/lib/site";
import HeroGraph from "../HeroGraph";
import { Arrow } from "../icons";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow eyebrow-rule">Business solutions across industries</p>
          <h1 className="hero-title" id="hero-title">
            <span className="hero-line">Built around</span>
            <span className="hero-line hero-line-accent">your business.</span>
          </h1>
          <p className="hero-lede">
            We design and build practical digital solutions — software, data and automation — for tourism,
            technology, agriculture, healthcare, transport, retail and&nbsp;beyond.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href={anchor(HOME_SECTION.services)}>
              Explore our services
              <Arrow />
            </a>
            <a className="link-underline" href={anchor(HOME_SECTION.contact)}>
              Start a conversation
            </a>
          </div>
        </div>

        <HeroGraph graph={graph as RawGraph} />
      </div>
    </section>
  );
}
