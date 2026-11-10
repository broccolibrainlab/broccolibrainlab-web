type SplitSectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

// Shared two-column layout for the below-the-fold sections: the heading on the left, content on the right.
export default function SplitSection({ id, title, children }: SplitSectionProps) {
  const titleId = `${id}-title`;
  return (
    <section className={`section ${id}`} id={id} aria-labelledby={titleId}>
      <div className="container section-grid">
        <h2 className="section-title" id={titleId}>
          {title}
        </h2>
        <div className="section-body">{children}</div>
      </div>
    </section>
  );
}
