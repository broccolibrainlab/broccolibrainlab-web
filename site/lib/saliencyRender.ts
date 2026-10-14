// Canvas drawing for the saliency tool: colour ramp, composites, and file downloads. Browser-only.

import type { Fixation, GrayMap } from "./saliency";

export type View = "overlay" | "map" | "original";

/** Sequential "heat" ramp (inferno), dark → bright. Lightness rises steadily, so it still reads without colour. */
export const HEAT_STOPS: readonly (readonly [number, string])[] = [
  [0, "#000004"],
  [1 / 7, "#1f0c48"],
  [2 / 7, "#550f6d"],
  [3 / 7, "#88226a"],
  [4 / 7, "#ba3655"],
  [5 / 7, "#e35933"],
  [6 / 7, "#f98e09"],
  [1, "#fcffa4"],
];

export const HEAT_GRADIENT = `linear-gradient(to right, ${HEAT_STOPS.map(([t, c]) => `${c} ${(t * 100).toFixed(1)}%`).join(", ")})`;

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

const HEAT_LUT = (() => {
  const lut = new Uint8ClampedArray(256 * 3);
  const stops = HEAT_STOPS.map(([t, c]) => [t, ...hexToRgb(c)]);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let s = 0;
    while (s < stops.length - 2 && t > stops[s + 1][0]) s++;
    const [t0, ...a] = stops[s];
    const [t1, ...b] = stops[s + 1];
    const f = (t - t0) / (t1 - t0);
    for (let c = 0; c < 3; c++) lut[i * 3 + c] = a[c] + (b[c] - a[c]) * f;
  }
  return lut;
})();

function mapCanvas(map: GrayMap, pixel: (v: number, out: Uint8ClampedArray, p: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = map.width;
  canvas.height = map.height;
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(map.width, map.height);
  for (let i = 0; i < map.data.length; i++) pixel(map.data[i], image.data, i * 4);
  ctx.putImageData(image, 0, 0);
  return canvas;
}

export type Layers = { overlay: HTMLCanvasElement; heat: HTMLCanvasElement; gray: HTMLCanvasElement };

/** Pre-renders the map once per result: a translucent overlay, an opaque heatmap and a greyscale map. */
export function mapLayers(map: GrayMap): Layers {
  const heatPixel = (v: number, out: Uint8ClampedArray, p: number) => {
    const k = Math.round(v * 255) * 3;
    out[p] = HEAT_LUT[k];
    out[p + 1] = HEAT_LUT[k + 1];
    out[p + 2] = HEAT_LUT[k + 2];
  };
  return {
    // The least salient tenth stays clear; colour builds up to fully opaque at 0.7.
    overlay: mapCanvas(map, (v, out, p) => {
      heatPixel(v, out, p);
      out[p + 3] = Math.min(1, Math.max(0, (v - 0.1) / 0.6)) * 255;
    }),
    heat: mapCanvas(map, (v, out, p) => {
      heatPixel(v, out, p);
      out[p + 3] = 255;
    }),
    gray: mapCanvas(map, (v, out, p) => {
      out[p] = out[p + 1] = out[p + 2] = v * 255;
      out[p + 3] = 255;
    }),
  };
}

export type CompositeOptions = {
  view: View;
  opacity: number;
  fixations: readonly Fixation[];
  fontFamily: string;
  /** Enlarges fixation markers, for images shown much smaller than they are drawn. */
  markerScale?: number;
};

/** Draws the chosen view at width × height. Transparent parts of the image sit on white, as the models see them. */
export function drawComposite(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  image: CanvasImageSource,
  layers: Layers,
  { view, opacity, fixations, fontFamily, markerScale = 1 }: CompositeOptions,
) {
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, width, height);

  if (view === "map") {
    ctx.drawImage(layers.heat, 0, 0, width, height);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    if (view === "overlay") {
      ctx.globalAlpha = opacity;
      ctx.drawImage(layers.overlay, 0, 0, width, height);
      ctx.globalAlpha = 1;
    }
  }

  if (fixations.length) drawFixations(ctx, width, height, fixations, fontFamily, markerScale);
  ctx.restore();
}

/** Open rings joined in order, each with a numbered badge, so the fixated spot itself stays visible.
    Sizes are relative to the image so they read the same at any resolution. */
function drawFixations(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fixations: readonly Fixation[],
  fontFamily: string,
  scale: number,
) {
  const unit = (Math.max(width, height) / 100) * scale;
  const ring = Math.max(14, unit * 3.2);
  const badge = Math.max(9, unit * 1.5);
  const line = Math.max(1.5, unit * 0.28);
  const halo = "rgba(20, 24, 21, 0.6)";
  const ink = "#f7f7f2";
  const points = fixations.map((f) => [f.x * width, f.y * height] as const);

  // Each path segment runs between ring edges, not centres, so it never crosses a fixated spot.
  const strokeTwice = (draw: () => void) => {
    for (const [style, w] of [
      [halo, line * 3],
      [ink, line],
    ] as const) {
      ctx.beginPath();
      draw();
      ctx.strokeStyle = style;
      ctx.lineWidth = w;
      ctx.stroke();
    }
  };
  ctx.lineCap = "round";
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const length = Math.hypot(x1 - x0, y1 - y0);
    if (length <= ring * 2) continue;
    const ux = (x1 - x0) / length;
    const uy = (y1 - y0) / length;
    strokeTwice(() => {
      ctx.moveTo(x0 + ux * ring, y0 + uy * ring);
      ctx.lineTo(x1 - ux * ring, y1 - uy * ring);
    });
  }
  for (const [x, y] of points) strokeTwice(() => ctx.arc(x, y, ring, 0, Math.PI * 2));

  ctx.font = `600 ${badge * 1.15}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  points.forEach(([x, y], i) => {
    // Badge sits on the ring at the upper right, nudged inside the image near the edges.
    const bx = Math.min(width - badge - 1, Math.max(badge + 1, x + ring * Math.SQRT1_2));
    const by = Math.min(height - badge - 1, Math.max(badge + 1, y - ring * Math.SQRT1_2));
    ctx.beginPath();
    ctx.arc(bx, by, badge, 0, Math.PI * 2);
    ctx.fillStyle = "#141815";
    ctx.fill();
    ctx.lineWidth = line;
    ctx.strokeStyle = ink;
    ctx.stroke();
    ctx.fillStyle = ink;
    ctx.fillText(String(i + 1), bx, by + badge * 0.06);
  });
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function saveCanvas(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => blob && saveBlob(blob, filename), "image/png");
}

/** Fixations in the original image's pixel coordinates. */
export function fixationsCsv(fixations: readonly Fixation[], width: number, height: number) {
  const rows = fixations.map((f, i) =>
    [i + 1, Math.round(f.x * width), Math.round(f.y * height), f.x.toFixed(4), f.y.toFixed(4), f.value.toFixed(4)].join(","),
  );
  return ["order,x_px,y_px,x_fraction,y_fraction,salience", ...rows].join("\n") + "\n";
}
