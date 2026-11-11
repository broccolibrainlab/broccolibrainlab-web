import { HOME_SECTION, anchor } from "@/lib/site";
import HeroPhoto from "../landing/HeroPhoto";
import LpHero from "../landing/LpHero";
import Pill from "../landing/Pill";

export default function Hero() {
  return (
    <LpHero
      overlay
      media={
        // Photo: "Group stacking hands in colorful sweaters", Unsplash (Zyx1bK9mqmA), Unsplash Licence.
        <HeroPhoto photo="team" alt="Many hands from people in different sweaters, stacked together in a circle." />
      }
      title={["Better together,", "for the world."]}
      lede={<>People from different fields, connecting to build better solutions for the&nbsp;world.</>}
      actions={
        <>
          <Pill href={anchor(HOME_SECTION.focus)} chip>
            Explore our focus areas
          </Pill>
          <Pill href={anchor(HOME_SECTION.contact)}>Join us</Pill>
        </>
      }
    />
  );
}
