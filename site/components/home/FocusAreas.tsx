import brainGraph from "@/assets/data/brain-graph.json";
import businessGraph from "@/assets/data/business-graph.json";
import gamingGraph from "@/assets/data/gaming-graph.json";
import type { RawGraph } from "@/lib/brainEngine";
import { AREAS, HOME_SECTION, anchor, type Area } from "@/lib/site";
import GraphSvg from "../GraphSvg";
import SmartLink from "../SmartLink";
import { Arrow } from "../icons";
import Pill from "./Pill";

// Each card shows the artwork from that area's own hero.
const ART: Record<Area["key"], RawGraph> = {
  business: businessGraph as RawGraph,
  neuro: brainGraph as RawGraph,
  gaming: gamingGraph as RawGraph,
};

export default function FocusAreas() {
  return (
    <section className="lp-areas" id={HOME_SECTION.focus} aria-labelledby="focus-title">
      <div className="lp-wrap">
        <div className="lp-head">
          <div>
            <h2 className="lp-big" id="focus-title">
              Our focus areas
            </h2>
            <p className="lp-big lp-head-lede">Business, neuroscience and gaming: where the people who connect here build, research and play.</p>
          </div>
          <div className="lp-head-aside">
            <p className="lp-small">Each area has its own page, projects and people. Start with the one closest to your field.</p>
            <Pill href={anchor(HOME_SECTION.contact)} variant="outline">
              Get in touch
            </Pill>
          </div>
        </div>

        <ul className="lp-cards" role="list">
          {AREAS.map((area) => (
            <li className="lp-card" key={area.key}>
              <h3 className="lp-small lp-card-title">
                <SmartLink className="lp-card-link" href={area.href}>
                  {area.label}
                </SmartLink>
                <Arrow />
              </h3>
              <p className="lp-small lp-card-text">{area.summary}</p>
              <div className="lp-card-art">
                <GraphSvg graph={ART[area.key]} className="graph-svg lp-card-graph" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
