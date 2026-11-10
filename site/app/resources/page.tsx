import MovedPage, { movedMetadata } from "@/components/MovedPage";
import { PAGE } from "@/lib/site";

// Resources moved under the Neuroscience Lab; this keeps old links working.
export const metadata = movedMetadata("Resources have moved");

export default function OldResourcesPage() {
  return <MovedPage to={PAGE.neuroResources} label="Resources" />;
}
