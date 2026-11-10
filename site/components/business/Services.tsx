import { BUSINESS_SECTION, anchor } from "@/lib/site";
import LpIntro from "../landing/LpIntro";
import Pill from "../landing/Pill";

const SERVICES = [
  { figure: "Strategy", label: "& discovery", text: "We learn how you work and find what’s worth building." },
  { figure: "Software", label: "& platforms", text: "Web apps, internal tools and integrations that fit." },
  { figure: "Data", label: "& automation", text: "Clear insight from your data, and less routine work." },
];

export default function Services() {
  return (
    <LpIntro
      id={BUSINESS_SECTION.services}
      title="What we do"
      paragraphs={[
        "We build practical digital solutions for organisations of every size, in many different industries.",
        "Each one starts with how your business works today, not with a ready-made product.",
        "Then we design, build and keep improving it with you, one useful step at a time.",
      ]}
      action={<Pill href={anchor(BUSINESS_SECTION.approach)}>How we work</Pill>}
      figures={SERVICES}
    />
  );
}
