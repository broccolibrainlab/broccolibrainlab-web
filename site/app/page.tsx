import type { Viewport } from "next";
import PageShell from "@/components/PageShell";
import Approach from "@/components/business/Approach";
import Contact from "@/components/business/Contact";
import Hero from "@/components/business/Hero";
import Industries from "@/components/business/Industries";
import Interests from "@/components/business/Interests";
import Services from "@/components/business/Services";
import Team from "@/components/business/Team";
import { THEME_COLOR } from "@/lib/site";

export const viewport: Viewport = { themeColor: THEME_COLOR.business };

export default function Home() {
  return (
    <PageShell theme="business">
      <Hero />
      <Services />
      <Interests />
      <Industries />
      <Approach />
      <Team />
      <Contact />
    </PageShell>
  );
}
