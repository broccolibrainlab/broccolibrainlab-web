"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const trimSlash = (path: string) => path.replace(/\/+$/, "") || "/";

/** The current path without a trailing slash ("/" for the home page). */
export const useCurrentPath = () => trimSlash(usePathname());

type SmartLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  /** Mark the link aria-current when it points at the current page (or "true" for pages inside it). */
  markCurrent?: boolean;
};

/**
 * Section links (`/page/#id`) become plain `#id` anchors on that page, so the browser scrolls in place and
 * InPageFocus can move focus; everywhere else they're client-side Next links.
 */
export default function SmartLink({ href, markCurrent = false, children, ...rest }: SmartLinkProps) {
  const current = useCurrentPath();
  const [path, hash] = href.split("#");
  const target = trimSlash(path || current);

  if (hash !== undefined && target === current) {
    return (
      <a href={`#${hash}`} {...rest}>
        {children}
      </a>
    );
  }

  let ariaCurrent: "page" | "true" | undefined;
  if (markCurrent && hash === undefined) {
    if (target === current) ariaCurrent = "page";
    else if (target !== "/" && current.startsWith(`${target}/`)) ariaCurrent = "true";
  }

  return (
    <Link href={href} aria-current={ariaCurrent} {...rest}>
      {children}
    </Link>
  );
}
