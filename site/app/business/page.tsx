import type { Metadata, Viewport } from "next";
import PageShell from "@/components/PageShell";
import Approach from "@/components/business/Approach";
import Contact from "@/components/business/Contact";
import Hero from "@/components/business/Hero";
import Services from "@/components/business/Services";
import { SITE, THEME_COLOR } from "@/lib/site";

export const metadata: Metadata = {
  title: `Business Solutions · ${SITE.name}`,
  description:
    "Practical digital solutions — software, data and automation — for tourism, technology, agriculture, healthcare, transport, retail and beyond.",
};

export const viewport: Viewport = { themeColor: THEME_COLOR.business };

export default function BusinessPage() {
  return (
    <PageShell theme="business" area="business">
      <Hero />
      <Services />
      <Approach />
      <Contact />
    </PageShell>
  );
}
