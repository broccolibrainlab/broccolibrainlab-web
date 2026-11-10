import { GAMING_SECTION, anchor } from "@/lib/site";
import LpIntro from "../landing/LpIntro";
import Pill from "../landing/Pill";

const AREAS = [
  { figure: "Game design", label: "Feel first", text: "Mechanics, levels and the feel of play." },
  { figure: "Play", label: "& cognition", text: "How games use attention, memory and reward." },
  { figure: "Building", label: "together", text: "We prototype, playtest and iterate as a team." },
];

export default function Exploring() {
  return (
    <LpIntro
      id={GAMING_SECTION.exploring}
      title="What we’re exploring"
      paragraphs={[
        "We make small games, and we make them to learn something.",
        "Each one is a question about play: what holds attention, what feels fair, what makes people want one more round.",
        "Designers, developers and players build them together, and every playtest shapes the next version.",
      ]}
      action={<Pill href={anchor(GAMING_SECTION.play)}>Our first game</Pill>}
      figures={AREAS}
    />
  );
}
