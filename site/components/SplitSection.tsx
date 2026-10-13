import type { SectionId } from "@/lib/site";

type SplitSectionProps = {
  id: SectionId;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
};

// Shared two-column layout for the below-the-fold sections: label + heading on the left, content on the right.
export default function SplitSection({ id, eyebrow, title, children }: SplitSectionProps) {
  const titleId = `${id}-title`;
  return (
    <section className={`section ${id}`} id={id} aria-labelledby={titleId}>
      <div className="container section-grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="section-title" id={titleId}>
            {title}
          </h2>
        </div>
        <div className="section-body">{children}</div>
      </div>
    </section>
  );
}
