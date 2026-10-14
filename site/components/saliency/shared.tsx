// Types, image loading and the settings panel shared by the single-image and compare views.

import {
  computeSaliency,
  fitSize,
  summarizeSaliency,
  type GrayMap,
  type RGBAImage,
  type SaliencyMethod,
  type SaliencySummary,
} from "@/lib/saliency";
import { HEAT_GRADIENT, type View } from "@/lib/saliencyRender";

const WORK_SIZE = 640; // longest side the models analyse
export const FIXATION_RADIUS = 0.1; // inhibition of return, as a fraction of the longest side

export const METHODS: readonly { id: SaliencyMethod; label: string; text: string }[] = [
  { id: "itti", label: "Itti–Koch", text: "Brightness, colour and orientation contrast across scales. Biologically inspired." },
  { id: "spectral", label: "Spectral residual", text: "Fast; finds what breaks the image’s usual structure. Brightness only." },
  { id: "frequency", label: "Frequency-tuned", text: "Highlights whole regions whose colour stands out. Colour only." },
];

export const VIEWS: readonly { id: View; label: string }[] = [
  { id: "overlay", label: "Overlay" },
  { id: "map", label: "Heatmap" },
  { id: "original", label: "Original" },
];

export const methodLabel = (id: SaliencyMethod) => METHODS.find((m) => m.id === id)!.label;

export type Settings = {
  method: SaliencyMethod;
  view: View;
  opacity: number;
  showFixations: boolean;
  fixationCount: number;
};

export const DEFAULT_SETTINGS: Settings = { method: "itti", view: "overlay", opacity: 0.75, showFixations: true, fixationCount: 5 };

/** An image ready for analysis. `image` may be a reduced copy; width and height are always the original's. */
export type Source = { name: string; image: CanvasImageSource; width: number; height: number; pixels: RGBAImage };

export type Result = {
  source: Source;
  method: SaliencyMethod;
  map: GrayMap;
  /** Map values in ascending order, for "higher than N% of the image" readouts. */
  sorted: Float32Array;
  summary: SaliencySummary | null;
  ms: number;
};

export function analyse(source: Source, method: SaliencyMethod): Result {
  const start = performance.now();
  const map = computeSaliency(source.pixels, method);
  const ms = performance.now() - start;
  return { source, method, map, sorted: Float32Array.from(map.data).sort(), summary: summarizeSaliency(map, FIXATION_RADIUS), ms };
}

/** Keeps the image for display and export, plus a copy at working size for the models. */
export function toSource(name: string, image: CanvasImageSource, width: number, height: number): Source {
  const [w, h] = fitSize(width, height, Math.min(WORK_SIZE, Math.max(width, height)));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#ffffff"; // transparent areas are analysed as white
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, w, h);
  return { name, image, width, height, pixels: ctx.getImageData(0, 0, w, h) };
}

export function sampleSource(label: string, image: RGBAImage): Source {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext("2d")!.putImageData(new ImageData(Uint8ClampedArray.from(image.data), image.width, image.height), 0, 0);
  return toSource(`${label.toLowerCase().replace(/\s+/g, "-")}.png`, canvas, image.width, image.height);
}

export class SourceError extends Error {}

/** Decodes an image file. With displayMax, a larger image is kept only as a reduced copy, to save memory. */
export async function sourceFromFile(file: File, displayMax?: number): Promise<Source> {
  if (file.type && !file.type.startsWith("image/")) {
    throw new SourceError("That file isn’t an image. Try a JPEG, PNG, WebP or GIF.");
  }
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new SourceError("That image couldn’t be opened in this browser. Try saving it as a JPEG or PNG first.");
  }
  const { width, height } = bitmap;
  if (!displayMax || Math.max(width, height) <= displayMax) return toSource(file.name, bitmap, width, height);

  const [w, h] = fitSize(width, height, displayMax);
  const reduced = document.createElement("canvas");
  reduced.width = w;
  reduced.height = h;
  const ctx = reduced.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return toSource(file.name, reduced, width, height);
}

export const formatStandout = (v: number) => (v >= 20 ? "20× or more" : `${v.toFixed(1)}×`);
export const formatArea = (v: number) => `${(v * 100).toFixed(v < 0.1 ? 1 : 0)}%`;

/** Model, view and fixation controls, plus a slot for the view's own summary and downloads. */
export function SettingsPanel({
  settings,
  onChange,
  name,
  children,
}: {
  settings: Settings;
  onChange: (next: Settings) => void;
  /** Prefix for the radio group names, so the two views' panels don't share a group. */
  name: string;
  children: React.ReactNode;
}) {
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => onChange({ ...settings, [key]: value });
  return (
    <div className="tool-panel">
      <fieldset className="tool-group">
        <legend className="tool-label">Model</legend>
        {METHODS.map((m) => (
          <label className="tool-option" key={m.id}>
            <input
              type="radio"
              name={`${name}-method`}
              value={m.id}
              checked={settings.method === m.id}
              onChange={() => set("method", m.id)}
            />
            <span>
              <span className="tool-option-title">{m.label}</span>
              <span className="tool-option-text">{m.text}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className="tool-group">
        <legend className="tool-label">View</legend>
        <div className="tool-segmented">
          {VIEWS.map((v) => (
            <label key={v.id}>
              <input type="radio" name={`${name}-view`} value={v.id} checked={settings.view === v.id} onChange={() => set("view", v.id)} />
              {v.label}
            </label>
          ))}
        </div>
        <label className={`tool-range${settings.view === "overlay" ? "" : " is-disabled"}`}>
          <span>Overlay strength</span>
          <output>{Math.round(settings.opacity * 100)}%</output>
          <input
            type="range"
            min={0.2}
            max={1}
            step={0.05}
            value={settings.opacity}
            disabled={settings.view !== "overlay"}
            onChange={(event) => set("opacity", Number(event.target.value))}
          />
        </label>
        <div className="tool-legend" aria-hidden="true">
          <div className="tool-legend-bar" style={{ background: HEAT_GRADIENT }} />
          <div className="tool-legend-labels">
            <span>Less salient</span>
            <span>More salient</span>
          </div>
        </div>
      </fieldset>

      <fieldset className="tool-group">
        <legend className="tool-label">Predicted fixations</legend>
        <label className="tool-check">
          <input type="checkbox" checked={settings.showFixations} onChange={(event) => set("showFixations", event.target.checked)} />
          Show on image
        </label>
        <label className="tool-range">
          <span>How many</span>
          <output>{settings.fixationCount}</output>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={settings.fixationCount}
            onChange={(event) => set("fixationCount", Number(event.target.value))}
          />
        </label>
      </fieldset>

      {children}
    </div>
  );
}
