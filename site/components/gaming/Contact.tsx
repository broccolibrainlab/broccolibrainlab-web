import { GAMING_SECTION } from "@/lib/site";
import LpClosing from "../landing/LpClosing";

export default function Contact() {
  return (
    <LpClosing
      id={GAMING_SECTION.contact}
      title="Want to playtest?"
      statement="Try early builds, tell us what works, and help shape the games we make next."
      note="Players, designers and developers"
      subject="Playtesting"
    />
  );
}
