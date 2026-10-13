"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MOBILE_NAV_QUERY, NAV_ITEMS, SITE, anchor } from "@/lib/site";
import LogoMark from "./LogoMark";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const focusFirstLink = useRef(false);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Move focus into the menu once it has rendered open.
  useEffect(() => {
    if (open && focusFirstLink.current) {
      focusFirstLink.current = false;
      navRef.current?.querySelector("a")?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!navRef.current?.contains(target) && !toggleRef.current?.contains(target)) close(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
    };
  }, [open, close]);

  // Leaving the mobile layout resets the menu so the desktop nav is never hidden.
  useEffect(() => {
    const query = window.matchMedia(MOBILE_NAV_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (!event.matches) setOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const onToggle = () => {
    focusFirstLink.current = !open;
    setOpen(!open);
  };

  const onNavClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest("a") && window.matchMedia(MOBILE_NAV_QUERY).matches) close(false);
  };

  return (
    <header className="site-header" id="top">
      <div className="container header-inner">
        <a className="brand" href="#top">
          <LogoMark className="brand-mark" size={32} />
          <span className="brand-name">{SITE.name}</span>
        </a>

        <button
          ref={toggleRef}
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={onToggle}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <svg className="nav-toggle-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path className="line-top" d="M4 8h16" />
            <path className="line-bottom" d="M4 16h16" />
          </svg>
        </button>

        <nav
          ref={navRef}
          className={open ? "site-nav is-open" : "site-nav"}
          id="site-nav"
          aria-label="Main"
          onClick={onNavClick}
        >
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={anchor(item.id)}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
