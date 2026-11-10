import type { Area, Theme } from "@/lib/site";
import AreaNav from "./AreaNav";
import InPageFocus from "./InPageFocus";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type PageShellProps = {
  /** The palette for the whole page (see the data-page-theme blocks in app/globals.css). */
  theme: Theme;
  /** Focus-area pages show the area's name in the header (and the Neuroscience Lab its secondary bar). */
  area?: Area["key"];
  children: React.ReactNode;
};

// Every page shares this frame, so header, footer and spacing stay identical and only the palette changes.
export default function PageShell({ theme, area, children }: PageShellProps) {
  return (
    <div className="page-theme" data-page-theme={theme}>
      {/* The target of every "#top" link (the logo on the home page, "Back to top"). It sits above the
          sticky header: the header is always on screen, so linking to it would not scroll anywhere. */}
      <div id="top" className="page-top" />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader area={area} />
      {area && <AreaNav area={area} />}
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <InPageFocus />
    </div>
  );
}
