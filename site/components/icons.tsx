type SvgProps = {
  className: string;
  viewBox: string;
  children: React.ReactNode;
};

// Decorative inline SVG; styling (stroke, size) comes from the class.
function Svg({ className, viewBox, children }: SvgProps) {
  return (
    <svg className={className} viewBox={viewBox} aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

const ARROW_PATHS = {
  right: "M2 8h11.5M9 3.5 13.5 8 9 12.5",
  left: "M14 8H2.5M7 3.5 2.5 8 7 12.5",
  up: "M8 13.5V2.5M3.5 7 8 2.5 12.5 7",
  external: "M4.5 11.5 11.5 4.5M5.5 4.5h6v6",
  down: "M4 6.5 8 10.5 12 6.5",
};

export function Arrow({ direction = "right" }: { direction?: keyof typeof ARROW_PATHS }) {
  return (
    <Svg className={`arrow arrow-${direction}`} viewBox="0 0 16 16">
      <path d={ARROW_PATHS[direction]} />
    </Svg>
  );
}

export function HeadIcon() {
  return (
    <Svg className="area-icon" viewBox="0 0 64 72">
      <path d="M19 70V56.5C10.5 51 6 42 6 31.5 6 15.5 18 4 33 4c14.5 0 25 10.5 25 23.5v2.5l5 8.6c.8 1.5 0 2.9-1.6 2.9H58v7.5c0 4-2.6 6.5-6.5 6.5H46V70" />
      <path d="M24.5 33.5c-4.5.2-6-5-2.8-7.4-1-4.4 3.3-7.6 6.9-6.1 2.2-4.2 8.3-4.2 10.3.1 4.2-.9 7.2 3.3 5 6.6 3 3.2.3 8-4 7-2 3-6.6 3.2-8.6.6-2.3 2.4-6.2 1.6-6.8-.8z" />
      <path d="M30.5 22.5c2.6 1.6.4 4.7 3.4 6.2M38 25c-2.4 1.3-.3 4.4-3.6 5.6M26 28.5c1.8-.6 3.4.2 4.4 1.6" />
    </Svg>
  );
}

export function WaveIcon() {
  return (
    <Svg className="area-icon area-icon-wave" viewBox="1 4 70 58">
      <path d="M2 34h9c3.5 0 4.6-8 7-8s3.3 22 5.6 22S27 6 29.6 6s3.6 54 6.4 54 3.6-46 6.4-46 3.4 30 5.8 30 3-16 5.2-16 3.2 6 6.2 6H70" />
    </Svg>
  );
}

export function PeopleIcon() {
  return (
    <Svg className="area-icon area-icon-people" viewBox="3 3 66 42">
      <circle cx="36" cy="11" r="7" />
      <path d="M24.5 44v-6c0-7 5-12.5 11.5-12.5S47.5 31 47.5 38v6" />
      <circle cx="15.5" cy="18.5" r="5.5" />
      <path d="M4 44v-4c0-5.6 4.4-9.5 10-9.5 3 0 5.4 1 7.2 2.6" />
      <circle cx="56.5" cy="18.5" r="5.5" />
      <path d="M68 44v-4c0-5.6-4.4-9.5-10-9.5-3 0-5.4 1-7.2 2.6" />
      <path d="M4 44h64" />
    </Svg>
  );
}

// ---- Business services ----

/** Strategy & discovery: a compass. */
export function CompassIcon() {
  return (
    <Svg className="area-icon area-icon-square" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="27" />
      <path d="M32 5v6M32 53v6M5 32h6M53 32h6" />
      <path d="m41.5 22.5-6.2 12.8-12.8 6.2 6.2-12.8z" />
      <circle cx="32" cy="32" r="1.6" />
    </Svg>
  );
}

/** Software & platforms: a browser window with code brackets. */
export function PlatformIcon() {
  return (
    <Svg className="area-icon area-icon-square" viewBox="0 0 64 64">
      <rect x="4" y="9" width="56" height="46" rx="4" />
      <path d="M4 20h56" />
      <path d="M10.5 14.5h.01M16 14.5h.01M21.5 14.5h.01" />
      <path d="m25 30-7 7 7 7M39 30l7 7-7 7M35 28l-6 18" />
    </Svg>
  );
}

/** Data & automation: bars with a rising trend. */
export function InsightIcon() {
  return (
    <Svg className="area-icon area-icon-square" viewBox="0 0 64 64">
      <path d="M5 59h54" />
      <path d="M11 59V42h9v17M27.5 59V33h9v26M44 59V22h9v37" />
      <path d="m8 31 13-11 9 6 21-18" />
      <path d="M43 8h8v8" />
    </Svg>
  );
}

// ---- Gaming ----

/** Game design: a controller. */
export function ControllerIcon() {
  return (
    <Svg className="area-icon area-icon-wide" viewBox="0 0 72 48">
      <path d="M22 6h28c8 0 13 4.5 15.5 12l4.2 14.6c1.6 6-1.5 11.4-7 11.4-3.3 0-5.7-1.8-7.8-4.6L51 34H21l-3.9 5.4C15 42.2 12.6 44 9.3 44c-5.5 0-8.6-5.4-7-11.4L6.5 18C9 10.5 14 6 22 6z" />
      <path d="M19 17v10M14 22h10" />
      <circle cx="50" cy="18" r="1.8" />
      <circle cx="56" cy="24" r="1.8" />
      <circle cx="44" cy="24" r="1.8" />
      <circle cx="50" cy="30" r="1.8" />
    </Svg>
  );
}

/** Play & cognition: a target with a cursor, for attention and decisions in play. */
export function FocusIcon() {
  return (
    <Svg className="area-icon area-icon-square" viewBox="0 0 64 64">
      <circle cx="28" cy="28" r="23" />
      <circle cx="28" cy="28" r="14" />
      <circle cx="28" cy="28" r="5" />
      <path d="m37 37 19.5 7-7.5 3.5-3.5 7.5z" />
    </Svg>
  );
}

/** Envelope, for email links. */
export function MailIcon() {
  return (
    <Svg className="mail-icon" viewBox="0 0 20 16">
      <rect x="1.5" y="1.5" width="17" height="13" rx="2" />
      <path d="m2.5 3 7.5 6 7.5-6" />
    </Svg>
  );
}

/** Head-and-shoulders outline: the placeholder for a team photo. */
export function PersonIcon() {
  return (
    <Svg className="person-icon" viewBox="0 0 80 80">
      <circle cx="40" cy="29" r="14" />
      <path d="M14 76v-4c0-14.4 11.6-24 26-24s26 9.6 26 24v4" />
    </Svg>
  );
}

// ---- Home ----

/** Collaboration: three people-nodes joined into a network. */
export function NetworkIcon() {
  return (
    <Svg className="area-icon area-icon-square" viewBox="0 0 64 64">
      <circle cx="32" cy="11" r="7" />
      <circle cx="11" cy="50" r="7" />
      <circle cx="53" cy="50" r="7" />
      <path d="M28.5 17 14.5 44M35.5 17l14 27M18 50h28" />
      <circle cx="32" cy="37" r="3.5" />
      <path d="M32 18v15.5M14.5 46l14.5-7.5M49.5 46 35 38.5" />
    </Svg>
  );
}

/** Better solutions for the world: a globe. */
export function GlobeIcon() {
  return (
    <Svg className="area-icon area-icon-square" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="27" />
      <path d="M5 32h54M32 5v54" />
      <path d="M32 5c-10 7.5-14 17-14 27s4 19.5 14 27M32 5c10 7.5 14 17 14 27s-4 19.5-14 27" />
      <path d="M9.5 18h45M9.5 46h45" />
    </Svg>
  );
}
