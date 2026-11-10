import { BUSINESS_SECTION } from "@/lib/site";
import { CompassIcon, InsightIcon, PlatformIcon } from "../icons";

const SERVICES = [
  {
    icon: <CompassIcon />,
    title: "Strategy & discovery",
    text: "We learn how you work and find what’s worth building.",
  },
  {
    icon: <PlatformIcon />,
    title: "Software & platforms",
    text: "Web apps, internal tools and integrations that fit.",
  },
  {
    icon: <InsightIcon />,
    title: "Data & automation",
    text: "Clear insight from your data, and less routine work.",
  },
];

export default function Services() {
  return (
    <section className="exploring" id={BUSINESS_SECTION.services} aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <h2 className="exploring-title" id="services-title">
            What we do
          </h2>
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
