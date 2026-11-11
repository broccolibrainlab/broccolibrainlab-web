import { BUSINESS_SECTION, anchor } from "@/lib/site";
import HeroPhoto from "../landing/HeroPhoto";
import LpHero from "../landing/LpHero";
import Pill from "../landing/Pill";

export default function Hero() {
  return (
    <LpHero
      overlay
      media={
        // Photo: "Man standing in front of people sitting beside table with laptop computers", Unsplash (gMsnXqILjp4), Unsplash Licence.
        <HeroPhoto photo="business" alt="A team around a large table with laptops, listening to a colleague present." />
      }
      title={["Built around", "your business."]}
      lede={<>Practical software, data and automation, shaped around how your organisation&nbsp;works.</>}
      actions={
        <>
          <Pill href={anchor(BUSINESS_SECTION.services)} chip>
            Explore our services
          </Pill>
          <Pill href={anchor(BUSINESS_SECTION.contact)}>Start a conversation</Pill>
        </>
      }
    />
  );
}
