import { BUSINESS_SECTION } from "@/lib/site";
import { LpAside } from "../landing/LpProcess";

// The industries we build for. scripts/make-hero-graphs.mjs uses the same six; keep the two in step.
const INDUSTRIES = [
  { title: "Tourism & hospitality", text: "Bookings, guests and day-to-day operations." },
  { title: "Technology", text: "Products, integrations and internal platforms." },
  { title: "Agriculture", text: "Crops, stock, supply and field data." },
  { title: "Healthcare", text: "Privacy-aware tools for clinics and patients." },
  { title: "Transport & logistics", text: "Fleets, routes and deliveries." },
  { title: "Retail & e-commerce", text: "Storefronts, orders and customer insight." },
];

// The left half of the "How we work" band.
export default function Industries() {
  return (
    <LpAside id={BUSINESS_SECTION.industries} title="The industries we work with" lede="Six fields so far, and always open to the next one.">
      <ul className="lp-list" role="list">
        {INDUSTRIES.map((industry) => (
          <li className="lp-list-item" key={industry.title}>
            <h3 className="lp-small lp-list-title">{industry.title}</h3>
            <p className="lp-small lp-list-text">{industry.text}</p>
          </li>
        ))}
      </ul>
    </LpAside>
  );
}
