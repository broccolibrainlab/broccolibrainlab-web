import { HOME_SECTION } from "@/lib/site";
import LpClosing from "../landing/LpClosing";

export default function Contact() {
  return (
    <LpClosing
      id={HOME_SECTION.contact}
      title="Join us."
      statement="Build with us, learn with us, or bring us a problem worth solving."
      note="Engineers, researchers, designers and students"
      subject="Hello from the website"
    />
  );
}
