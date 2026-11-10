"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MOBILE_NAV_QUERY, NAV_ITEMS, PAGE, SITE, type Area } from "@/lib/site";
import { Arrow } from "./icons";
import LogoMark from "./LogoMark";
import SmartLink, { trimSlash, useCurrentPath } from "./SmartLink";

/** "Focus areas": a disclosure menu on desktop, a plain labelled group inside the mobile menu. */
function AreasMenu({ label, areas }: { label: string; areas: readonly Area[] }) {
  const current = useCurrentPath();
  const [open, setOpen] = useState(false);
  const groupRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inArea = areas.some((area) => {
    const href = trimSlash(area.href);
    return current === href || current.startsWith(`${href}/`);
  });

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: MouseEvent) => {
      if (!groupRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onFocus = (event: FocusEvent) => {
      if (!groupRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onPointer);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onPointer);
      document.removeEventListener("focusin", onFocus);
    };
  }, [open]);

  return (
    <li className="nav-group" ref={groupRef}>
      <button
        ref={buttonRef}
        className={inArea ? "nav-group-toggle is-current" : "nav-group-toggle"}
        type="button"
        aria-expanded={open}
        aria-controls="areas-menu"
        onClick={() => setOpen(!open)}
      >
        {label}
        <Arrow direction="down" />
      </button>
      <p className="nav-group-label" id="areas-label">
        {label}
      </p>
      <div className={open ? "nav-group-panel is-open" : "nav-group-panel"} id="areas-menu">
        <ul aria-labelledby="areas-label" onClick={(event) => (event.target as HTMLElement).closest("a") && setOpen(false)}>
          {areas.map((area) => (
            <li key={area.key}>
              <SmartLink className={`area-link tone-${area.key}`} href={area.href} markCurrent>
                <span className="area-link-dot" aria-hidden="true" />
                <span className="area-link-body">
                  <span className="area-link-title">{area.label}</span>
                  <span className="area-link-text">{area.summary}</span>
                </span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function SiteHeader() {
  const current = useCurrentPath();
  const onHome = current === PAGE.home;
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
        {onHome ? (
          <a className="brand" href="#top">
            <LogoMark className="brand-mark" size={32} />
            <span className="brand-name">{SITE.name}</span>
          </a>
        ) : (
          <Link className="brand" href={PAGE.home}>
            <LogoMark className="brand-mark" size={32} />
            <span className="brand-name">{SITE.name}</span>
          </Link>
        )}

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
            {NAV_ITEMS.map((item) =>
              "areas" in item ? (
                <AreasMenu key={item.label} label={item.label} areas={item.areas} />
              ) : (
                <li key={item.label}>
                  <SmartLink href={item.href}>{item.label}</SmartLink>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
