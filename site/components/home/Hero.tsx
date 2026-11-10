import Image from "next/image";
import heroPhoto from "@/assets/images/hero-team.jpg";
import { HOME_SECTION, anchor } from "@/lib/site";
import Pill from "./Pill";

/** Fine rays fanning out from a point low in the frame, drawn over the photo. */
function Rays() {
  const rays = Array.from({ length: 48 }, (_, i) => {
    const angle = (i / 48) * Math.PI * 2;
    const [ox, oy] = [700, 470];
    return {
      x1: ox + Math.cos(angle) * 210,
      y1: oy + Math.sin(angle) * 210,
      x2: ox + Math.cos(angle) * (i % 2 ? 620 : 900),
      y2: oy + Math.sin(angle) * (i % 2 ? 620 : 900),
    };
  });
  return (
    <svg className="lp-rays" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
      ))}
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="lp-hero" aria-labelledby="hero-title">
      <div className="lp-hero-media">
        {/* Photo: "Group stacking hands in colorful sweaters", Unsplash (Zyx1bK9mqmA), Unsplash Licence. */}
        <Image
          className="lp-hero-photo"
          src={heroPhoto}
          alt="Many hands from people in different sweaters, stacked together in a circle."
          priority
          sizes="100vw"
        />
        <Rays />
        <h1 className="lp-hero-title" id="hero-title">
          <span>Better together,</span> <span>for the world.</span>
        </h1>
      </div>

      <div className="lp-hero-panel">
        <p className="lp-big">People from different fields, connecting to build better solutions for the&nbsp;world.</p>
        <div className="lp-actions">
          <Pill href={anchor(HOME_SECTION.focus)} chip>
            Explore our focus areas
          </Pill>
          <Pill href={anchor(HOME_SECTION.contact)}>Join us</Pill>
        </div>
      </div>
    </section>
  );
}
