// A plain <picture>, not next/image: the site is a static export, so next/image can't resize. The sizes are pre-built.
import { HERO_PHOTOS } from "@/lib/heroPhotos";

const base = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/hero/`;
const withBase = (srcset: string) =>
  srcset
    .split(", ")
    .map((entry) => base + entry)
    .join(", ");

// The hero fills the window below the header (at least 560px tall) and crops the photo to cover it, so on a
// tall, narrow screen the photo is drawn wider than the window. Ask for whichever width is larger.
const SIZES = "max(100vw, calc(max(100vh - 48px, 560px) * 1.72))";

/**
 * A hero photo from scripts/make-hero-photos.mjs: grayscale AVIF (JPEG where AVIF isn't supported) at the
 * width the screen needs, fetched first. Until it arrives, a tiny blurred copy inlined in the page shows in
 * its place, so the hero is never an empty block on a slow connection.
 */
export default function HeroPhoto({ photo, alt }: { photo: keyof typeof HERO_PHOTOS; alt: string }) {
  const source = HERO_PHOTOS[photo];
  return (
    <picture>
      <source type="image/avif" srcSet={withBase(source.avif)} sizes={SIZES} />
      <img
        className="lp-hero-photo"
        src={base + source.fallback}
        srcSet={withBase(source.jpeg)}
        sizes={SIZES}
        width={source.width}
        height={source.height}
        alt={alt}
        fetchPriority="high"
        style={{ backgroundImage: `url(${source.preview})` }}
      />
    </picture>
  );
}
