import { AREAS, AREA_NAV, type Area } from "@/lib/site";
import SmartLink from "./SmartLink";

/** Secondary bar under the header on each focus-area page: the area's name and its sections. */
export default function AreaNav({ area: key }: { area: Area["key"] }) {
  const area = AREAS.find((a) => a.key === key)!;
  return (
    <nav className="area-nav" aria-label={area.label}>
      <div className="container area-nav-inner">
        <SmartLink className="area-nav-home" href={area.href}>
          <span className="area-link-dot" aria-hidden="true" />
          {area.label}
        </SmartLink>
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
