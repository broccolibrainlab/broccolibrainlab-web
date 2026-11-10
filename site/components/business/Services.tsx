import { HOME_SECTION } from "@/lib/site";
import { CompassIcon, InsightIcon, PlatformIcon } from "../icons";

const SERVICES = [
  {
    icon: <CompassIcon />,
    title: "Strategy & discovery",
    text: "Understanding the problem first: how you work today, where it hurts, and what is worth building.",
  },
  {
    icon: <PlatformIcon />,
    title: "Software & platforms",
    text: "Web apps, internal tools and integrations, designed around your people and your processes.",
  },
  {
    icon: <InsightIcon />,
    title: "Data & automation",
    text: "Turning the data you already have into clear insight, and automating the routine work.",
  },
];

export default function Services() {
  return (
    <section className="exploring" id={HOME_SECTION.services} aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <h2 className="exploring-title" id="services-title">
            What we do
          </h2>
          <p className="caption" aria-hidden="true">
            Discover · Build · Improve
          </p>
        </div>

        <ul className="areas" role="list">
          {SERVICES.map((service) => (
            <li className="area" key={service.title}>
              {service.icon}
              <div>
                <h3 className="area-title">{service.title}</h3>
                <p className="area-text">{service.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
