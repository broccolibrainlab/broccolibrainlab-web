import MovedPage, { movedMetadata } from "@/components/MovedPage";
import { PAGE } from "@/lib/site";

// The saliency tool moved under the Neuroscience Lab; this keeps old links working.
export const metadata = movedMetadata("Saliency map has moved");

export default function OldSaliencyPage() {
  return <MovedPage to={PAGE.saliency} label="the Saliency map" />;
}
