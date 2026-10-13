import { SECTION } from "@/lib/site";
import SplitSection from "./SplitSection";

const TOPICS = [
  {
    title: "EEG interpretation",
    text: "What brain signals can and can’t tell us, and how to read them carefully.",
  },
  {
    title: "Memory encoding",
    text: "How experiences become memories, and what shapes that process.",
  },
  {
    title: "Attention",
    text: "How we choose what to focus on, and how mental load affects it.",
  },
  {
    title: "Mindfulness",
    text: "Reading on mindfulness and how it relates to attention and cognition.",
  },
];

export default function Notes() {
  return (
    <SplitSection id={SECTION.notes} eyebrow="Notes" title="What we’re reading and discussing.">
      <ol className="topics" role="list">
        {TOPICS.map((topic, index) => (
          <li className="topic" key={topic.title}>
            <span className="topic-num" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="topic-title">{topic.title}</h3>
              <p className="topic-text">{topic.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="aside-note">Published notes will be added here later.</p>
    </SplitSection>
  );
}
