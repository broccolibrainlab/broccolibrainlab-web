import { SITE } from "@/lib/site";
import { Arrow } from "./icons";
import LogoMark from "./LogoMark";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-brand">
          <LogoMark size={28} />
          <span>{SITE.name}</span>
        </p>
        <p className="footer-tagline">{SITE.tagline}</p>
        <a className="footer-top" href="#top">
          Back to top
          <Arrow direction="up" />
        </a>
      </div>
    </footer>
  );
}
