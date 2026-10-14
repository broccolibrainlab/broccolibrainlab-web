/* Visual-search displays with a single odd item out ("pop-out"), drawn without a canvas so the same images
   serve as the saliency tool's samples and as the test fixtures in tests/saliency.test.ts. */

import type { RGBAImage } from "./saliency";

export type Stimulus = {
  image: RGBAImage;
  /** Centre and radius of the odd item, in pixels. */
  target: { x: number; y: number; radius: number };
};

export const STIMULUS_WIDTH = 640;
export const STIMULUS_HEIGHT = 480;
const COLS = 6;
const ROWS = 5;
/** Number of grid cells, so callers can pick any cell as the target. */
export const STIMULUS_CELLS = COLS * ROWS;

type Rgb = readonly [number, number, number];
/** Signed distance from a point (relative to the item's centre) to the item's edge; negative inside. */
type Shape = (dx: number, dy: number) => number;

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const disc =
  (radius: number): Shape =>
  (dx, dy) =>
    Math.hypot(dx, dy) - radius;

const bar =
  (halfLength: number, halfWidth: number, angle: number): Shape =>
  (dx, dy) => {
    const u = dx * Math.cos(angle) + dy * Math.sin(angle);
    const v = -dx * Math.sin(angle) + dy * Math.cos(angle);
    return Math.max(Math.abs(u) - halfLength, Math.abs(v) - halfWidth);
  };

function display(
  background: Rgb,
  extent: number,
  distractor: { shape: Shape; colour: Rgb },
  target: { shape: Shape; colour: Rgb },
  targetCell: number,
  seed: number,
): Stimulus {
  const width = STIMULUS_WIDTH;
  const height = STIMULUS_HEIGHT;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data.set(background, i);
    data[i + 3] = 255;
  }

  const random = mulberry32(seed);
  const cellW = width / COLS;
  const cellH = height / ROWS;
  const cell = ((targetCell % STIMULUS_CELLS) + STIMULUS_CELLS) % STIMULUS_CELLS;
  let targetCentre = { x: 0, y: 0 };

  for (let index = 0; index < STIMULUS_CELLS; index++) {
    // Jitter each item inside its cell so the layout isn't a perfectly regular grid.
    const cx = ((index % COLS) + 0.5) * cellW + (random() - 0.5) * cellW * 0.3;
    const cy = (Math.floor(index / COLS) + 0.5) * cellH + (random() - 0.5) * cellH * 0.3;
    const item = index === cell ? target : distractor;
    if (index === cell) targetCentre = { x: cx, y: cy };

    for (let y = Math.max(0, Math.floor(cy - extent)); y <= Math.min(height - 1, Math.ceil(cy + extent)); y++) {
      for (let x = Math.max(0, Math.floor(cx - extent)); x <= Math.min(width - 1, Math.ceil(cx + extent)); x++) {
        // One-pixel antialiased edge
        const coverage = Math.min(1, Math.max(0, 0.5 - item.shape(x + 0.5 - cx, y + 0.5 - cy)));
        if (coverage === 0) continue;
        const p = (y * width + x) * 4;
        for (let c = 0; c < 3; c++) data[p + c] = data[p + c] * (1 - coverage) + item.colour[c] * coverage;
      }
    }
  }
  return { image: { width, height, data }, target: { ...targetCentre, radius: extent } };
}

/** One red disc among green discs. */
export function colourPopout(targetCell = 10, seed = 7): Stimulus {
  return display([150, 150, 150], 22, { shape: disc(20), colour: [60, 160, 80] }, { shape: disc(20), colour: [205, 60, 55] }, targetCell, seed);
}

/** One tilted bar among vertical bars. */
export function orientationPopout(targetCell = 21, seed = 3): Stimulus {
  const vertical = bar(22, 5, Math.PI / 2);
  const tilted = bar(22, 5, Math.PI / 4);
  return display([190, 190, 190], 24, { shape: vertical, colour: [35, 35, 35] }, { shape: tilted, colour: [35, 35, 35] }, targetCell, seed);
}
