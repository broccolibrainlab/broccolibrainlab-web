import logoMark from "@/assets/images/logo-mark.png";

// The supplied refined logo mark, recoloured to the page's palette. The PNG is a single-colour
// silhouette, so it's used as a mask over the accent colour: the shape is the original pixels, only the
// colour follows the page (sage on the Neuroscience Lab, brass on the home page, violet on Gaming).
// Always decorative here: the brand name is shown as text beside it.
export default function LogoMark({ size, className }: { size: number; className?: string }) {
  return (
    <span
      className={className ? `logo-mark ${className}` : "logo-mark"}
      style={{ width: size, height: size, ["--logo-url" as string]: `url(${logoMark.src})` }}
      aria-hidden="true"
    />
  );
}
