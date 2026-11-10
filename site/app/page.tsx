import type { Viewport } from "next";
import PageShell from "@/components/PageShell";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import FocusAreas from "@/components/home/FocusAreas";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Team from "@/components/home/Team";
import { THEME_COLOR } from "@/lib/site";

export const viewport: Viewport = { themeColor: THEME_COLOR.home };

export default function Home() {
  return (
    <PageShell theme="home">
      <Hero />
      <About />
      <HowItWorks />
      <FocusAreas />
      <Team />
      <Contact />
    </PageShell>
  );
}
