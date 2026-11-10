import { GAMING_SECTION } from "@/lib/site";
import { ControllerIcon, FocusIcon, PeopleIcon } from "../icons";

const AREAS = [
  {
    icon: <ControllerIcon />,
    title: "Game design",
    text: "Mechanics, levels and the feel of play.",
  },
  {
    icon: <FocusIcon />,
    title: "Play & cognition",
    text: "How games use attention, memory and reward.",
  },
  {
    icon: <PeopleIcon />,
    title: "Building together",
    text: "We prototype, playtest and iterate as a team.",
  },
];

export default function Exploring() {
  return (
    <section className="exploring" id={GAMING_SECTION.exploring} aria-labelledby="exploring-title">
      <div className="container">
        <div className="section-head">
          <h2 className="exploring-title" id="exploring-title">
            What we’re exploring
          </h2>
        </div>

        <ul className="areas" role="list">
          {AREAS.map((area) => (
            <li className="area" key={area.title}>
              {area.icon}
              <div>
                <h3 className="area-title">{area.title}</h3>
                <p className="area-text">{area.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
