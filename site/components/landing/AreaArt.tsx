import type { Area } from "@/lib/site";

// Illustrations for the focus areas, drawn as SVG at build time (no image files), in the site palette:
// charcoal, deep green, sage and pale paper, with strong light/dark contrast.
//   business  a desk with a monitor showing a dashboard (figures, bar and line charts), a phone with a
//             chart, a mug, and gears for automation
//   gaming    a screen showing a small platform level with our own character (a broccoli sprout, after
//             the lab's name), and a game controller in front
// "light" sits on paper (the business card); "dark" sits on charcoal (the gaming card and game stage).
// The area pages' heroes use photos instead (components/business/Hero.tsx, components/gaming/Hero.tsx).
// The level and its character are our own: plain stone platforms, leaves to collect and a doorway out.
// Each scene is drawn once in a 600 × 450 box, then placed to suit the card, hero or game stage.

type Tone = "light" | "dark";
type Variant = "card" | "stage";

const BUSINESS = {
  light: { bg: "#e6eae1", dots: "#141815", bezel: "#141815", screen: "#f7f7f2", card: "#e6eae1", primary: "#2f5a3c", secondary: "#a4c7ae", ink: "#1b251e", desk: "#141815" },
  dark: { bg: "#141815", dots: "#a4c7ae", bezel: "#e6eae1", screen: "#1b251e", card: "#2a372d", primary: "#a4c7ae", secondary: "#4f7a5c", ink: "#e2f8e6", desk: "#a4c7ae" },
};

const GAMING = {
  light: { bg: "#e6eae1", dots: "#141815", bezel: "#141815", sky: "#cfd8ca", hill: "#a4c7ae", hill2: "#b8c9b9", cloud: "#f7f7f2", ground: "#2f5a3c", groundTop: "#4f7a5c", block: "#1b251e", coin: "#2f5a3c", floret: "#2f5a3c", floretLight: "#4f7a5c", stem: "#f7f7f2", eye: "#141815", hud: "#1b251e", pad: "#e6eae1", button: "#a4c7ae", button2: "#e6eae1", body: "#141815" },
  dark: { bg: "#1b251e", dots: "#a4c7ae", bezel: "#e6eae1", sky: "#0f1210", hill: "#2f5a3c", hill2: "#24302a", cloud: "#3a4a3e", ground: "#a4c7ae", groundTop: "#e2f8e6", block: "#a4c7ae", coin: "#e2f8e6", floret: "#a4c7ae", floretLight: "#e2f8e6", stem: "#e6eae1", eye: "#141815", hud: "#e2f8e6", pad: "#141815", button: "#2f5a3c", button2: "#4f7a5c", body: "#e6eae1" },
};

/** A gear: a disc with square teeth and a hole in the middle. */
function Gear({ cx, cy, r, fill, hole }: { cx: number; cy: number; r: number; fill: string; hole: string }) {
  const tooth = r * 0.5;
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={cx - tooth / 2} y={cy - r - tooth * 0.55} width={tooth} height={tooth} rx={2} fill={fill} transform={`rotate(${i * 45} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <circle cx={cx} cy={cy} r={r * 0.38} fill={hole} />
    </g>
  );
}

function BusinessScene({ tone }: { tone: Tone }) {
  const c = BUSINESS[tone];
  const bars = [40, 62, 50, 80, 72, 100];
  const line = "300,240 325,226 350,232 375,200 400,206 432,168";
  return (
    <g>
      {/* Automation: two gears turning together. */}
      <Gear cx={540} cy={92} r={24} fill={c.secondary} hole={c.bg} />
      <Gear cx={500} cy={52} r={14} fill={c.primary} hole={c.bg} />

      {/* Monitor and stand. */}
      <rect x={90} y={40} width={380} height={250} rx={14} fill={c.bezel} />
      <rect x={104} y={54} width={352} height={222} rx={4} fill={c.screen} />
      <rect x={255} y={290} width={50} height={40} fill={c.bezel} />
      <rect x={205} y={326} width={150} height={14} rx={7} fill={c.bezel} />

      {/* Dashboard: title bar, three figures, a bar chart and a rising line chart. */}
      <rect x={104} y={54} width={352} height={20} rx={4} fill={c.primary} />
      {[116, 128, 140].map((x) => (
        <circle key={x} cx={x} cy={64} r={3} fill={c.screen} />
      ))}
      {[116, 228, 340].map((x, i) => (
        <g key={x}>
          <rect x={x} y={86} width={104} height={44} rx={6} fill={c.card} />
          <rect x={x + 10} y={96} width={40} height={5} rx={2} fill={c.secondary} />
          <rect x={x + 10} y={108} width={i === 2 ? 48 : 62} height={12} rx={2} fill={c.ink} />
          {i === 2 && <path d={`M${x + 70} 120 l8 -12 l8 12 z`} fill={c.primary} />}
        </g>
      ))}
      <line x1={116} y1={262} x2={278} y2={262} stroke={c.ink} strokeOpacity={0.3} strokeWidth={2} />
      {bars.map((h, i) => (
        <rect key={i} x={122 + i * 26} y={262 - h} width={18} height={h} rx={2} fill={i % 2 ? c.secondary : c.primary} />
      ))}
      <rect x={290} y={146} width={154} height={116} rx={6} fill={c.card} />
      <polygon points={`${line} 432,252 300,252`} fill={c.secondary} opacity={0.45} />
      <polyline points={line} fill="none" stroke={c.primary} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={432} cy={168} r={6} fill={c.primary} />

      {/* Phone with a donut chart. */}
      <rect x={470} y={176} width={82} height={150} rx={14} fill={c.bezel} />
      <rect x={477} y={188} width={68} height={124} rx={6} fill={c.screen} />
      <circle cx={511} cy={228} r={20} fill="none" stroke={c.secondary} strokeWidth={10} />
      <circle cx={511} cy={228} r={20} fill="none" stroke={c.primary} strokeWidth={10} strokeDasharray="82 126" transform="rotate(-90 511 228)" />
      <rect x={489} y={262} width={44} height={6} rx={3} fill={c.card} />
      <rect x={489} y={274} width={30} height={6} rx={3} fill={c.card} />
      <rect x={489} y={290} width={44} height={12} rx={6} fill={c.primary} />

      {/* Mug, with steam. */}
      <circle cx={84} cy={314} r={11} fill="none" stroke={c.primary} strokeWidth={6} />
      <rect x={34} y={292} width={46} height={48} rx={6} fill={c.primary} />
      <path d="M48 282 c-6 -8 6 -12 0 -22 M64 282 c-6 -8 6 -12 0 -22" fill="none" stroke={c.secondary} strokeWidth={3} strokeLinecap="round" />

      {/* The desk. */}
      <line x1={16} y1={341} x2={584} y2={341} stroke={c.desk} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

/** Our own character: a small broccoli sprout with a face, mid-jump. (x, y) is between its feet. */
function Sprout({ x, y, c }: { x: number; y: number; c: (typeof GAMING)[Tone] }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-14 -14 l-12 -12 M14 -14 l12 -12" stroke={c.stem} strokeWidth={5} strokeLinecap="round" />
      <rect x={-14} y={-26} width={28} height={30} rx={8} fill={c.stem} />
      <circle cx={-15} cy={-38} r={14} fill={c.floret} />
      <circle cx={15} cy={-38} r={14} fill={c.floret} />
      <circle cx={0} cy={-50} r={17} fill={c.floret} />
      <circle cx={0} cy={-32} r={13} fill={c.floret} />
      <circle cx={-6} cy={-56} r={4} fill={c.floretLight} />
      <circle cx={14} cy={-44} r={3} fill={c.floretLight} />
      <circle cx={-6} cy={-12} r={3} fill={c.eye} />
      <circle cx={6} cy={-12} r={3} fill={c.eye} />
      <path d="M-5 -4 q5 4 10 0" fill="none" stroke={c.eye} strokeWidth={2} strokeLinecap="round" />
      <rect x={-13} y={4} width={10} height={6} rx={2} fill={c.eye} />
      <rect x={3} y={4} width={10} height={6} rx={2} fill={c.eye} />
    </g>
  );
}

function GamingScene({ tone, id }: { tone: Tone; id: string }) {
  const c = GAMING[tone];
  const clip = `${id}-screen`;
  const tiles = [];
  for (let x = 76; x < 524; x += 32) {
    if (x >= 364 && x < 396) continue; // a gap to jump over
    tiles.push(
      <g key={x}>
        <rect x={x} y={272} width={32} height={32} fill={c.ground} />
        <rect x={x} y={272} width={32} height={6} fill={c.groundTop} />
        <line x1={x} y1={272} x2={x} y2={304} stroke={c.sky} strokeWidth={2} />
      </g>,
    );
  }
  const heart = "M0 3 C0 -1 5 -1 6 2 C7 -1 12 -1 12 3 C12 7 6 10 6 12 C6 10 0 7 0 3Z";
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x={76} y={46} width={448} height={258} rx={4} />
        </clipPath>
      </defs>

      {/* The screen. */}
      <rect x={60} y={30} width={480} height={290} rx={16} fill={c.bezel} />
      <g clipPath={`url(#${clip})`}>
        <rect x={76} y={46} width={448} height={258} fill={c.sky} />
        <ellipse cx={170} cy={276} rx={120} ry={64} fill={c.hill} />
        <ellipse cx={440} cy={276} rx={96} ry={48} fill={c.hill2} />
        {[
          [120, 96],
          [360, 84],
        ].map(([x, y]) => (
          <g key={x} fill={c.cloud}>
            <rect x={x} y={y} width={70} height={18} rx={9} />
            <rect x={x + 16} y={y - 10} width={34} height={20} rx={10} />
          </g>
        ))}
        {tiles}
        {[236, 268, 300].map((x) => (
          <rect key={x} x={x} y={196} width={30} height={30} rx={3} fill={c.block} />
        ))}
        {/* Leaves to collect. */}
        {[252, 284, 316, 380].map((x, i) => (
          <path key={x} d="M0 8 C-9 2 -7 -8 0 -10 C7 -8 9 2 0 8Z M0 8 V-6" transform={`translate(${x} ${i === 3 ? 238 : 172}) rotate(${i % 2 ? 20 : -20})`} fill={c.coin} stroke={c.sky} strokeWidth={1.5} />
        ))}
        <path d="M150 268 Q178 190 214 186" fill="none" stroke={c.hud} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" opacity={0.6} />
        <Sprout x={214} y={196} c={c} />
        {/* The way out of the level: a lit doorway. */}
        <path d="M462 272 V214 a24 24 0 0 1 48 0 V272 Z" fill={c.hud} />
        <path d="M472 272 V218 a14 14 0 0 1 28 0 V272 Z" fill={c.hill} />
        {[96, 116, 136].map((x) => (
          <path key={x} d={heart} transform={`translate(${x} 60)`} fill={c.hud} />
        ))}
        <text x={508} y={72} textAnchor="end" fontFamily="ui-monospace, Menlo, monospace" fontSize={14} fontWeight={700} fill={c.hud}>
          0420
        </text>
      </g>

      {/* A game controller in front of the screen. */}
      <path
        d="M200 315 h200 c40 0 60 30 66 60 l8 30 c6 22 -10 40 -30 40 c-14 0 -24 -8 -32 -20 l-12 -16 h-140 l-12 16 c-8 12 -18 20 -32 20 c-20 0 -36 -18 -30 -40 l8 -30 c6 -30 26 -60 66 -60 z"
        fill={c.body}
      />
      <rect x={233} y={352} width={14} height={40} rx={2} fill={c.pad} />
      <rect x={220} y={365} width={40} height={14} rx={2} fill={c.pad} />
      {[
        [370, 352, c.button],
        [392, 372, c.button2],
        [370, 392, c.button],
        [348, 372, c.button2],
      ].map(([x, y, fill]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={9} fill={fill as string} />
      ))}
      <rect x={282} y={340} width={16} height={6} rx={3} fill={c.pad} />
      <rect x={306} y={340} width={16} height={6} rx={3} fill={c.pad} />
    </g>
  );
}

const SCENES = {
  business: ({ tone }: { tone: Tone; id: string }) => <BusinessScene tone={tone} />,
  gaming: ({ tone, id }: { tone: Tone; id: string }) => <GamingScene tone={tone} id={id} />,
} as const;

export type ArtArea = Extract<Area["key"], keyof typeof SCENES>;

export const hasArt = (key: Area["key"]): key is ArtArea => key in SCENES;

/** Canvas size and where the 600 × 450 scene sits on it: [width, height, x, y, scale]. */
const LAYOUT = {
  card: [600, 450, 0, 0, 1],
  stage: [1600, 900, 320, 70, 1.6],
} as const;

function Canvas({ area, tone, layout, className }: { area: ArtArea; tone: Tone; layout: keyof typeof LAYOUT; className: string }) {
  const [w, h, x, y, scale] = LAYOUT[layout];
  const id = `art-${area}-${tone}-${layout}`;
  const c = area === "business" ? BUSINESS[tone] : GAMING[tone];
  const Scene = SCENES[area];
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`${id}-dots`} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.4" fill={c.dots} opacity="0.12" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill={c.bg} />
      <rect width={w} height={h} fill={`url(#${id}-dots)`} />
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <Scene tone={tone} id={id} />
      </g>
    </svg>
  );
}

export default function AreaArt({ area, tone, variant = "card", className = "lp-art" }: { area: ArtArea; tone: Tone; variant?: Variant; className?: string }) {
  return <Canvas area={area} tone={tone} layout={variant} className={className} />;
}
