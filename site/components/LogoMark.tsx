import Image from "next/image";
import logoMark from "@/assets/images/logo-mark.png";

// The supplied refined logo mark. Always decorative here: the brand name is shown as text beside it.
export default function LogoMark({ size, className }: { size: number; className?: string }) {
  return <Image className={className} src={logoMark} width={size} height={size} alt="" />;
}
