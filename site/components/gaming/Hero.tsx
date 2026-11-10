import Image from "next/image";
import heroPhoto from "@/assets/images/hero-gaming.jpg";
import { GAMING_SECTION, anchor } from "@/lib/site";
import LpHero from "../landing/LpHero";
import Pill from "../landing/Pill";

export default function Hero() {
  return (
    <LpHero
      overlay
      media={
        // Photo: "Person sitting on gaming chair while playing video game", Unsplash (Mf23RF8xArY), Unsplash Licence.
        <Image className="lp-hero-photo" src={heroPhoto} alt="A player in a headset at a gaming event, facing a bright screen." priority sizes="100vw" />
      }
      title={["Made for play,", "built to learn."]}
      lede={<>Small games we design and build, for fun and to learn how people&nbsp;play.</>}
      actions={
        <>
          <Pill href={anchor(GAMING_SECTION.play)} chip>
            Play our game
          </Pill>
          <Pill href={anchor(GAMING_SECTION.exploring)}>What we explore</Pill>
        </>
      }
    />
  );
}
