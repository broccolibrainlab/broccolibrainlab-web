import Image from "next/image";
import heroPhoto from "@/assets/images/hero-business.jpg";
import { BUSINESS_SECTION, anchor } from "@/lib/site";
import LpHero from "../landing/LpHero";
import Pill from "../landing/Pill";

export default function Hero() {
  return (
    <LpHero
      overlay
      media={
        // Photo: "Man standing in front of people sitting beside table with laptop computers", Unsplash (gMsnXqILjp4), Unsplash Licence.
        <Image className="lp-hero-photo" src={heroPhoto} alt="A team around a large table with laptops, listening to a colleague present." priority sizes="100vw" />
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
