import { AREAS, HOME_SECTION, anchor } from "@/lib/site";
import SmartLink from "../SmartLink";
import { Arrow } from "../icons";
import AreaArt, { hasArt } from "../landing/AreaArt";
import Pill from "../landing/Pill";

export default function FocusAreas() {
  return (
    <section className="lp-areas" id={HOME_SECTION.focus} aria-labelledby="focus-title">
      <div className="lp-wrap">
        <div className="lp-head">
          <div>
            <h2 className="lp-big" id="focus-title">
              Our focus areas
            </h2>
            <p className="lp-big lp-head-lede">Business solutions and gaming: where the people who connect here build and play.</p>
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
                {hasArt(area.key) && <AreaArt area={area.key} tone={area.key === "business" ? "light" : "dark"} />}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
