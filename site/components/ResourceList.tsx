import Link from "next/link";
import { RESOURCES, isExternal, type Resource } from "@/lib/resources";
import { SITE } from "@/lib/site";
import { Arrow } from "./icons";

// The title link stretches over the whole row (see .resource-link::after), so one link covers the card.
function ResourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (isExternal(href)) {
    return (
      <a className="resource-link" href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="visually-hidden">(opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link className="resource-link" href={href}>
      {children}
    </Link>
  );
}

function ResourceItem({ resource }: { resource: Resource }) {
  return (
    <li className="resource">
      <div>
        <h3 className="resource-title">
          <ResourceLink href={resource.href}>{resource.title}</ResourceLink>
        </h3>
        <p className="resource-text">{resource.description}</p>
        {resource.tags && resource.tags.length > 0 && (
          <ul className="resource-tags" role="list" aria-label="Tags">
            {resource.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </div>
      <Arrow direction={isExternal(resource.href) ? "external" : "right"} />
    </li>
  );
}

export default function ResourceList() {
  const count = RESOURCES.length;
  return (
    <section className="resources-section" aria-labelledby="tools-title">
      <div className="container">
        <div className="section-head">
          <h2 className="exploring-title" id="tools-title">
            Tools
          </h2>
          <p className="caption">{count === 0 ? "Coming soon" : `${count} ${count === 1 ? "tool" : "tools"}`}</p>
        </div>

        {count === 0 ? (
          <div className="resources-empty">
            <p className="prose-lead">Nothing here yet. Our first tools are on the way.</p>
            <p className="prose">Each one will be listed here with a short note on what it does and how to use it.</p>
            <a className="link-underline" href={SITE.linkedinUrl} target="_blank" rel="noopener noreferrer">
              Follow along on LinkedIn
              <Arrow direction="external" />
              <span className="visually-hidden">(opens in a new tab)</span>
            </a>
          </div>
        ) : (
          <ul className="resources" role="list">
            {RESOURCES.map((resource) => (
              <ResourceItem key={resource.href} resource={resource} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
