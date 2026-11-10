import { AREAS, HOME_SECTION } from "@/lib/site";
import SmartLink from "../SmartLink";
import { Arrow } from "../icons";

/** Headlines for each interested area, in that area's own palette. */
const HEADLINES: Record<(typeof AREAS)[number]["key"], string> = {
  neuro: "Curious about the human brain.",
  gaming: "Made for play, built to learn.",
};

// The strip below the services: what we keep learning about alongside client work.
export default function Interests() {
  return (
    <section className="research interests" id={HOME_SECTION.interests} aria-labelledby="interests-title">
      <div className="container">
        <div className="interests-head">
          <p className="eyebrow research-label">Interested areas</p>
          <h2 className="research-title" id="interests-title">
            We never stop learning — beyond client work, we explore.
          </h2>
        </div>
        <ul className="interest-cards" role="list">
          {AREAS.map((area) => (
            <li className={`interest-card tone-${area.key}`} key={area.key}>
              <p className="interest-label">
                <span className="area-link-dot" aria-hidden="true" />
                {area.label}
              </p>
              <h3 className="interest-title">
                <SmartLink className="interest-link" href={area.href}>
                  {HEADLINES[area.key]}
                </SmartLink>
              </h3>
              <p className="interest-text">{area.summary}</p>
              <Arrow />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
