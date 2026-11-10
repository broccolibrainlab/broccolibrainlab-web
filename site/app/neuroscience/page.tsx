import type { Metadata, Viewport } from "next";
import PageShell from "@/components/PageShell";
import About from "@/components/neuroscience/About";
import Contact from "@/components/neuroscience/Contact";
import Exploring from "@/components/neuroscience/Exploring";
import Hero from "@/components/neuroscience/Hero";
import Notes from "@/components/neuroscience/Notes";
import ResearchStrip from "@/components/neuroscience/ResearchStrip";
import { SITE, THEME_COLOR } from "@/lib/site";

export const metadata: Metadata = {
  title: `Neuroscience Lab · ${SITE.name}`,
  description:
    "The Broccoli Brain Lab neuroscience group: undergraduates exploring cognition, memory and EEG through research and shared learning.",
};

export const viewport: Viewport = { themeColor: THEME_COLOR.neuro };

export default function NeurosciencePage() {
  return (
    <PageShell theme="neuro" area="neuro">
      <Hero />
      <Exploring />
      <ResearchStrip />
      <About />
      <Notes />
      <Contact />
    </PageShell>
  );
}
