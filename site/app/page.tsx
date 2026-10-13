import About from "@/components/About";
import Contact from "@/components/Contact";
import Exploring from "@/components/Exploring";
import Hero from "@/components/Hero";
import InPageFocus from "@/components/InPageFocus";
import Notes from "@/components/Notes";
import ResearchStrip from "@/components/ResearchStrip";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Exploring />
        <ResearchStrip />
        <About />
        <Notes />
        <Contact />
      </main>
      <SiteFooter />
      <InPageFocus />
    </>
  );
}
