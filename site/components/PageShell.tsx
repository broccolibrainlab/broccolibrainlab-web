import type { Area, Theme } from "@/lib/site";
import AreaNav from "./AreaNav";
import InPageFocus from "./InPageFocus";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type PageShellProps = {
  /** The palette for the whole page (see the data-page-theme blocks in app/globals.css). */
  theme: Theme;
  /** Interested-area pages get that area's secondary nav under the header. */
  area?: Area["key"];
  children: React.ReactNode;
};

// Every page shares this frame, so header, footer and spacing stay identical and only the palette changes.
export default function PageShell({ theme, area, children }: PageShellProps) {
  return (
    <div className="page-theme" data-page-theme={theme}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      {area && <AreaNav area={area} />}
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <InPageFocus />
    </div>
  );
}
