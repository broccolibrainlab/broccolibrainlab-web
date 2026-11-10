import type { Metadata, Viewport } from "next";
import ResourceList from "@/components/ResourceList";
import PageShell from "@/components/PageShell";
import { SITE, THEME_COLOR } from "@/lib/site";

export const metadata: Metadata = {
  title: `Resources · ${SITE.name}`,
  description: `Free tools built by ${SITE.name} for anyone learning about cognition, memory and EEG.`,
};

export const viewport: Viewport = { themeColor: THEME_COLOR.neuro };

export default function ResourcesPage() {
  return (
    <PageShell theme="neuro" area="neuro">
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
    </PageShell>
  );
}
