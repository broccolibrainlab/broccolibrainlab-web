"use client";

import { useState } from "react";
import { SECTION } from "@/lib/site";
import { Arrow } from "./icons";

const FACTS = [
  { term: "Status", detail: "In design" },
  { term: "Focus", detail: "Cognitive load and memory encoding" },
  { term: "Method", detail: "EEG signals" },
  { term: "Findings", detail: "To be shared when ready" },
];

export default function ResearchStrip() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="research" id={SECTION.research} aria-labelledby="research-title">
      <div className="container">
        <div className="research-strip">
          <div className="research-heading">
            <p className="eyebrow research-label">Research in progress</p>
            <h2 className="research-title" id="research-title">
              Cognitive load &amp; memory encoding
            </h2>
          </div>
          <button
            className="link-underline research-toggle"
            type="button"
            aria-expanded={expanded}
            aria-controls="research-details"
            onClick={() => setExpanded(!expanded)}
          >
            <span>{expanded ? "Hide project" : "View project"}</span>
            <Arrow />
          </button>
        </div>

        <div className="research-details" id="research-details" hidden={!expanded}>
          <p className="research-summary">
            We’re designing a study with a professor to explore cognitive load and memory encoding using EEG signals.
            The study is being developed; findings will be shared when the research is ready.
          </p>
          <dl className="facts">
            {FACTS.map((fact) => (
              <div className="fact" key={fact.term}>
                <dt>{fact.term}</dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
