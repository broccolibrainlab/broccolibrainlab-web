import type { Metadata } from "next";
import InPageFocus from "@/components/InPageFocus";
import ResourceList from "@/components/ResourceList";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Resources · ${SITE.name}`,
  description: `Free tools built by ${SITE.name} for anyone learning about cognition, memory and EEG.`,
};

export default function ResourcesPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="page-intro" aria-labelledby="page-title">
          <div className="container">
            <p className="eyebrow eyebrow-rule">Resources</p>
            <h1 className="page-title" id="page-title">
              Tools we build, free to use.
            </h1>
            <p className="page-lede">
              As we learn, we make small tools for working with brain data and research material. We share them here
              so others can use them too.
            </p>
          </div>
        </section>
        <ResourceList />
      </main>
      <SiteFooter />
      <InPageFocus />
    </>
  );
}
