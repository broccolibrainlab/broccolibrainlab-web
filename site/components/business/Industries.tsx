import { HOME_SECTION } from "@/lib/site";
import SplitSection from "../SplitSection";

// The industries we build for — the same six as the hero artwork (scripts/make-hero-graphs.mjs).
// Keep the two in step when you change either.
const INDUSTRIES = [
  {
    title: "Tourism & hospitality",
    text: "Bookings, guest communication and operations tools that make travel easier to sell and to run.",
  },
  {
    title: "Technology",
    text: "Product engineering, integrations and internal platforms for teams building their own tech.",
  },
  {
    title: "Agriculture",
    text: "Tracking crops, stock and supply, and turning field data into decisions growers can act on.",
  },
  {
    title: "Healthcare",
    text: "Careful, privacy-aware tools for clinics, practitioners and the people they look after.",
  },
  {
    title: "Transport & logistics",
    text: "Fleet, route and delivery tools that keep goods and people moving on time.",
  },
  {
    title: "Retail & e-commerce",
    text: "Storefronts, stock and order management, and customer insight that keep up with demand.",
  },
];

export default function Industries() {
  return (
    <SplitSection id={HOME_SECTION.industries} eyebrow="Industries" title="Solutions for different industries.">
      <p className="prose-lead">
        Every industry has its own rules, data and people. We learn yours first, then shape the solution around it.
      </p>
      <ol className="topics topics-spaced" role="list">
        {INDUSTRIES.map((industry, index) => (
          <li className="topic" key={industry.title}>
            <span className="topic-num" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="topic-title">{industry.title}</h3>
              <p className="topic-text">{industry.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="aside-note">Don’t see yours? We start from the problem, not the industry.</p>
    </SplitSection>
  );
}
