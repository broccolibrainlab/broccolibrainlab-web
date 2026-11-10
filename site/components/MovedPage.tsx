import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "./PageShell";

/** Metadata for a page that has moved: keep it out of search results. */
export const movedMetadata = (title: string): Metadata => ({ title, robots: { index: false } });

// The site is a static export, so there are no server redirects. Old URLs render this page, which
// forwards to the new address straight away (meta refresh, works without JavaScript) and links to it.
export default function MovedPage({ to, label }: { to: string; label: string }) {
  return (
    <PageShell theme="neuro" area="neuro">
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <section className="page-intro" aria-labelledby="page-title">
        <div className="container">
          <p className="eyebrow eyebrow-rule">Page moved</p>
          <h1 className="page-title" id="page-title">
            This page has a new address.
          </h1>
          <p className="page-lede">
            <Link className="link-underline" href={to}>
              Go to {label}
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
