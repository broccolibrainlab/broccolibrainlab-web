import { GAMING_SECTION } from "@/lib/site";
import { ControllerIcon, FocusIcon, PeopleIcon } from "../icons";

const AREAS = [
  {
    icon: <ControllerIcon />,
    title: "Game design",
    text: "Mechanics, levels and the feel of play: what makes a game worth another try.",
  },
  {
    icon: <FocusIcon />,
    title: "Play & cognition",
    text: "How games use attention, memory and reward — where our neuroscience interest meets play.",
  },
  {
    icon: <PeopleIcon />,
    title: "Building together",
    text: "We prototype, playtest with friends and iterate as a team.",
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
          <p className="caption" aria-hidden="true">
            Design · Play · People
          </p>
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
