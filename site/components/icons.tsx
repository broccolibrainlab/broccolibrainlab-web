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
