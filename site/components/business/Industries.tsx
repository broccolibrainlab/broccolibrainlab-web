import { BUSINESS_SECTION } from "@/lib/site";
import SplitSection from "../SplitSection";

// The industries we build for — the same six as the hero artwork (scripts/make-hero-graphs.mjs).
// Keep the two in step when you change either.
const INDUSTRIES = [
  { title: "Tourism & hospitality", text: "Bookings, guests and day-to-day operations." },
  { title: "Technology", text: "Products, integrations and internal platforms." },
  { title: "Agriculture", text: "Crops, stock, supply and field data." },
  { title: "Healthcare", text: "Privacy-aware tools for clinics and patients." },
  { title: "Transport & logistics", text: "Fleets, routes and deliveries." },
  { title: "Retail & e-commerce", text: "Storefronts, orders and customer insight." },
];

export default function Industries() {
  return (
    <SplitSection id={BUSINESS_SECTION.industries} title="The industries we work with.">
      <ul className="steps" role="list">
        {INDUSTRIES.map((industry) => (
          <li className="step" key={industry.title}>
            <h3 className="step-title">{industry.title}</h3>
            <p className="step-text">{industry.text}</p>
          </li>
        ))}
      </ul>
    </SplitSection>
  );
}
