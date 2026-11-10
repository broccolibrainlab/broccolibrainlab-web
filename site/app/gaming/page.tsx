import type { Metadata, Viewport } from "next";
import PageShell from "@/components/PageShell";
import Contact from "@/components/gaming/Contact";
import Exploring from "@/components/gaming/Exploring";
import Hero from "@/components/gaming/Hero";
import Play from "@/components/gaming/Play";
import { SITE, THEME_COLOR } from "@/lib/site";

export const metadata: Metadata = {
  title: `Gaming · ${SITE.name}`,
  description: `Games designed and built by ${SITE.name} — to have fun, and to learn how people focus, decide and play.`,
};

export const viewport: Viewport = { themeColor: THEME_COLOR.gaming };

export default function GamingPage() {
  return (
    <PageShell theme="gaming" area="gaming">
      <Hero />
      <Exploring />
      <Play />
      <Contact />
    </PageShell>
  );
}
