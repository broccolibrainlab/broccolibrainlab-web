import HeroBrain from "./HeroBrain";
import { SECTION, anchor } from "@/lib/site";
import { Arrow } from "./icons";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow eyebrow-rule">Student-led neuroscience</p>
          <h1 className="hero-title" id="hero-title">
            <span className="hero-line">Curious about</span>
            <span className="hero-line hero-line-accent">the human brain.</span>
          </h1>
          <p className="hero-lede">Exploring cognition, memory and EEG through research and shared&nbsp;learning.</p>
          <div className="hero-actions">
            <a className="button-primary" href={anchor(SECTION.exploring)}>
              Explore our work
              <Arrow />
            </a>
            <a className="link-underline" href={anchor(SECTION.about)}>
              Meet the team
            </a>
          </div>
        </div>

        <HeroBrain />
      </div>
    </section>
  );
}
