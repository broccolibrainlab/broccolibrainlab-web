import { AREAS, AREA_NAV, type Area } from "@/lib/site";
import SmartLink from "./SmartLink";

/** Secondary bar under the header on each interested-area page: where you are, and that area's sections. */
export default function AreaNav({ area: key }: { area: Area["key"] }) {
  const area = AREAS.find((a) => a.key === key)!;
  return (
    <nav className="area-nav" aria-label={area.label}>
      <div className="container area-nav-inner">
        <p className="area-nav-crumb">
          <span className="area-nav-parent">Interested areas</span>
          <span className="area-nav-sep" aria-hidden="true">
            /
          </span>
          <SmartLink className="area-nav-home" href={area.href}>
            {area.label}
          </SmartLink>
        </p>
        <ul className="area-nav-links">
          {AREA_NAV[key].map((item) => (
            <li key={item.label}>
              <SmartLink href={item.href} markCurrent>
                {item.label}
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
