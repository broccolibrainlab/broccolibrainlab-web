"use client";

import { useEffect, useRef, useState } from "react";
import { SITE, mailto } from "@/lib/site";
import { Arrow } from "../icons";

// The email button. A mailto: link only opens a mail app that is set up on the visitor's device; for anyone who
// uses webmail, clicking it does nothing. So the click still tries the mail app, and also opens a small panel
// with other ways to write to us: Gmail or Outlook on the web (a new message, addressed to us, subject filled
// in), or copying the address. Without JavaScript it is a plain mailto: link.

const gmail = (subject: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SITE.email)}&su=${encodeURIComponent(subject)}`;
const outlook = (subject: string) =>
  `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(SITE.email)}&subject=${encodeURIComponent(subject)}`;

export default function EmailPill({ subject }: { subject: string }) {
  const [open, setOpen] = useState(false);
  // "copied" once it is on the clipboard; "selected" if the clipboard was blocked and the text is selected instead.
  const [copied, setCopied] = useState<"" | "copied" | "selected">("");
  const wrap = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const copy = async () => {
    let result: "copied" | "selected" = "copied";
    try {
      await navigator.clipboard.writeText(SITE.email);
    } catch {
      // Clipboard blocked: select the address text instead, so the visitor can copy it themselves.
      const text = wrap.current?.querySelector(".lp-email-address");
      if (text) window.getSelection()?.selectAllChildren(text);
      result = "selected";
    }
    setCopied(result);
    window.setTimeout(() => setCopied(""), 3000);
  };

  return (
    <span className="lp-email" ref={wrap}>
      <a
        ref={button}
        className="lp-pill lp-pill-light has-chip"
        href={mailto(subject)}
        aria-expanded={open}
        aria-controls="email-options"
        // Let the mail app open as usual, and show the other options alongside.
        onClick={() => setOpen(true)}
      >
        <span className="lp-pill-label">{SITE.email}</span>
        <span className="lp-pill-chip" aria-hidden="true">
          <Arrow />
        </span>
      </a>

      <span className={open ? "lp-email-panel is-open" : "lp-email-panel"} id="email-options" role="group" aria-label="Other ways to email us">
        <span className="lp-email-note">
          No mail app opened? Write to <span className="lp-email-address">{SITE.email}</span> with:
        </span>
        <span className="lp-email-options">
          <a href={gmail(subject)} target="_blank" rel="noopener noreferrer">
            Gmail<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          <a href={outlook(subject)} target="_blank" rel="noopener noreferrer">
            Outlook<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          <button type="button" onClick={copy}>
            {copied === "copied" ? "Copied" : copied === "selected" ? "Selected: press copy" : "Copy address"}
          </button>
        </span>
        <span className="visually-hidden" aria-live="polite">
          {copied === "copied" ? "Email address copied" : copied === "selected" ? "Email address selected, ready to copy" : ""}
        </span>
      </span>
    </span>
  );
}
