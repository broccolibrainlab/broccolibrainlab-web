import { Arrow } from "../icons";

type PillProps = {
  href: string;
  children: React.ReactNode;
  /** "light" sits on the paper bands, "dark" on the black and green ones, "outline" is the quiet variant. */
  variant?: "light" | "dark" | "outline";
  /** Adds the round arrow chip at the end, for the main action of a group. */
  chip?: boolean;
  external?: boolean;
};

// The landing page's rounded, small-caps button.
export default function Pill({ href, children, variant = "light", chip = false, external = false }: PillProps) {
  return (
    <a
      className={`lp-pill lp-pill-${variant}${chip ? " has-chip" : ""}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="lp-pill-label">{children}</span>
      {chip && (
        <span className="lp-pill-chip" aria-hidden="true">
          <Arrow direction={external ? "external" : "right"} />
        </span>
      )}
      {external && <span className="visually-hidden"> (opens in a new tab)</span>}
    </a>
  );
}
