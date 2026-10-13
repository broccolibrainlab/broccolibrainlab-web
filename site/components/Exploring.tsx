import { SECTION } from "@/lib/site";
import { HeadIcon, PeopleIcon, WaveIcon } from "./icons";

const AREAS = [
  {
    icon: <HeadIcon />,
    title: "Cognition & memory",
    text: "Exploring attention, cognitive load and memory encoding.",
  },
  {
    icon: <WaveIcon />,
    title: "EEG & signal processing",
    text: "Learning to process and interpret brain signals.",
  },
  {
    icon: <PeopleIcon />,
    title: "Learning together",
    text: "Reading, discussing and taking part in EEG competitions.",
  },
];

export default function Exploring() {
  return (
    <section className="exploring" id={SECTION.exploring} aria-labelledby="exploring-title">
      <div className="container">
        <div className="section-head">
          <h2 className="exploring-title" id="exploring-title">
            What we’re exploring
          </h2>
          <p className="caption" aria-hidden="true">
            Questions · Methods · People
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
