"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { computeSaliency, fitSize, predictFixations, type GrayMap, type RGBAImage, type SaliencyMethod } from "@/lib/saliency";
import { HEAT_GRADIENT, drawComposite, fixationsCsv, mapLayers, saveBlob, saveCanvas, type View } from "@/lib/saliencyRender";
import { colourPopout, orientationPopout } from "@/lib/saliencyStimuli";

const WORK_SIZE = 640; // longest side the models analyse
const DISPLAY_MIN = 800; // the on-screen canvas is drawn at 800–1600 px on its longest side
const DISPLAY_MAX = 1600;
const EXPORT_MAX = 4096; // downloads match the original image, up to this size
const FIXATION_RADIUS = 0.1; // inhibition of return, as a fraction of the longest side

export const METHODS: readonly { id: SaliencyMethod; label: string; text: string }[] = [
  { id: "itti", label: "Itti–Koch", text: "Brightness, colour and orientation contrast across scales. Biologically inspired." },
  { id: "spectral", label: "Spectral residual", text: "Fast; finds what breaks the image’s usual structure. Brightness only." },
  { id: "frequency", label: "Frequency-tuned", text: "Highlights whole regions whose colour stands out. Colour only." },
];

const VIEWS: readonly { id: View; label: string }[] = [
  { id: "overlay", label: "Overlay" },
  { id: "map", label: "Heatmap" },
  { id: "original", label: "Original" },
];

const SAMPLES = [
  { label: "Colour pop-out", make: () => colourPopout().image },
  { label: "Orientation pop-out", make: () => orientationPopout().image },
];

type Source = { name: string; image: CanvasImageSource; width: number; height: number; pixels: RGBAImage };
type Result = { source: Source; method: SaliencyMethod; map: GrayMap; sorted: Float32Array; ms: number };

/** Keeps the full image for display and export, plus a copy at working size for the models. */
function toSource(name: string, image: CanvasImageSource, width: number, height: number): Source {
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

function sampleSource(label: string, image: RGBAImage): Source {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext("2d")!.putImageData(new ImageData(Uint8ClampedArray.from(image.data), image.width, image.height), 0, 0);
  return toSource(`${label.toLowerCase().replace(/\s+/g, "-")}.png`, canvas, image.width, image.height);
}

const methodLabel = (id: SaliencyMethod) => METHODS.find((m) => m.id === id)!.label;

export default function SaliencyTool() {
  const [source, setSource] = useState<Source | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [method, setMethod] = useState<SaliencyMethod>("itti");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("overlay");
  const [opacity, setOpacity] = useState(0.75);
  const [showFixations, setShowFixations] = useState(true);
  const [fixationCount, setFixationCount] = useState(5);
  const [hover, setHover] = useState<{ value: number; percent: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const runRef = useRef(0);

  // A result is only shown with the image it was computed for.
  const current = result && result.source === source ? result : null;
  const layers = useMemo(() => (current ? mapLayers(current.map) : null), [current]);
  const fixations = useMemo(
    () => (current ? predictFixations(current.map, fixationCount, FIXATION_RADIUS) : []),
    [current, fixationCount],
  );
  const shownFixations = useMemo(() => (showFixations ? fixations : []), [showFixations, fixations]);

  const analyse = (next: Source, nextMethod: SaliencyMethod) => {
    const run = ++runRef.current;
    setSource(next);
    setMethod(nextMethod);
    setBusy(true);
    setError(null);
    setHover(null);
    // A short timeout lets the "Analysing" state paint before the main thread gets busy. (Not
    // requestAnimationFrame: it never fires in a background tab, which would stall the analysis.)
    window.setTimeout(() => {
      if (run !== runRef.current) return;
      const start = performance.now();
      const map = computeSaliency(next.pixels, nextMethod);
      setResult({ source: next, method: nextMethod, map, sorted: Float32Array.from(map.data).sort(), ms: performance.now() - start });
      setBusy(false);
    }, 30);
  };

  const openFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.type && !file.type.startsWith("image/")) {
      setError("That file isn’t an image. Try a JPEG, PNG, WebP or GIF.");
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      analyse(toSource(file.name, bitmap, bitmap.width, bitmap.height), method);
    } catch {
      setError("That image couldn’t be opened in this browser. Try saving it as a JPEG or PNG first.");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !source) return;
    const longest = Math.max(source.width, source.height);
    const [w, h] = fitSize(source.width, source.height, Math.min(DISPLAY_MAX, Math.max(DISPLAY_MIN, longest)));
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    if (layers) {
      drawComposite(ctx, w, h, source.image, layers, {
        view,
        opacity,
        fixations: shownFixations,
        fontFamily: getComputedStyle(canvas).fontFamily,
      });
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(source.image, 0, 0, w, h);
    }
  }, [source, layers, view, opacity, shownFixations]);

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const { map, sorted } = current;
    const x = Math.min(map.width - 1, Math.max(0, Math.floor(((event.clientX - rect.left) / rect.width) * map.width)));
    const y = Math.min(map.height - 1, Math.max(0, Math.floor(((event.clientY - rect.top) / rect.height) * map.height)));
    const value = map.data[y * map.width + x];
    let lo = 0;
    let hi = sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] < value) lo = mid + 1;
      else hi = mid;
    }
    setHover({ value, percent: Math.round((lo / sorted.length) * 100) });
  };

  const exportName = (suffix: string) =>
    `${(source?.name ?? "image").replace(/\.[^.]+$/, "")}-${suffix}-${current?.method ?? method}`;

  const exportCanvas = (draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) => {
    if (!source) return null;
    const [w, h] = fitSize(source.width, source.height, Math.min(EXPORT_MAX, Math.max(source.width, source.height)));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    draw(canvas.getContext("2d")!, w, h);
    return canvas;
  };

  const downloadMap = () => {
    if (!layers) return;
    const canvas = exportCanvas((ctx, w, h) => {
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(layers.gray, 0, 0, w, h);
    });
    if (canvas) saveCanvas(canvas, `${exportName("saliency")}.png`);
  };

  const downloadView = () => {
    if (!layers || !source) return;
    const fontFamily = canvasRef.current ? getComputedStyle(canvasRef.current).fontFamily : "sans-serif";
    const canvas = exportCanvas((ctx, w, h) =>
      drawComposite(ctx, w, h, source.image, layers, { view, opacity, fixations: shownFixations, fontFamily }),
    );
    if (canvas) saveCanvas(canvas, `${exportName(view)}.png`);
  };

  const downloadFixations = () => {
    if (!source) return;
    const csv = fixationsCsv(fixations, source.width, source.height);
    saveBlob(new Blob([csv], { type: "text/csv" }), `${exportName("fixations")}.csv`);
  };

  const viewLabel = VIEWS.find((v) => v.id === view)!.label;

  let readout = "";
  if (hover) readout = `Salience here: ${hover.value.toFixed(2)}, higher than ${hover.percent}% of the image.`;
  else if (current && fixations.length === 0) readout = "Nothing stands out in this image: it has no contrast to work with.";
  else if (current) readout = "Point at the image to read the salience at any spot (0 = least, 1 = most).";

  return (
    <div className="tool">
      <div className="tool-main">
        <div className="tool-toolbar">
          <button className="button-primary" type="button" onClick={() => fileRef.current?.click()}>
            {source ? "Choose another image" : "Choose an image"}
          </button>
          <input
            ref={fileRef}
            className="visually-hidden"
            type="file"
            accept="image/*"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              openFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <div className="tool-samples">
            <span>Or try a sample:</span>
            {SAMPLES.map((sample) => (
              <button
                key={sample.label}
                className="tool-chip"
                type="button"
                onClick={() => analyse(sampleSource(sample.label, sample.make()), method)}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`tool-stage${source ? " has-image" : ""}${dragging ? " is-dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            openFile(event.dataTransfer.files[0]);
          }}
        >
          {source ? (
            <canvas
              ref={canvasRef}
              className="tool-canvas"
              role="img"
              aria-label={`${source.name}, ${viewLabel.toLowerCase()} view`}
              onPointerMove={onPointerMove}
              onPointerLeave={() => setHover(null)}
            />
          ) : (
            <div className="tool-empty">
              <p className="tool-empty-title">Drop an image here</p>
              <p>or choose one from your device. JPEG, PNG, WebP or GIF.</p>
            </div>
          )}
          {busy && <p className="tool-busy">Analysing…</p>}
        </div>

        <p className="tool-readout">{readout}</p>
        {error && (
          <p className="tool-error" role="alert">
            {error}
          </p>
        )}
        <p className="tool-privacy">Your image stays on your device. It’s analysed in your browser and never uploaded.</p>
        <p className="visually-hidden" role="status">
          {busy ? "Analysing image…" : current ? `Saliency map ready, using ${methodLabel(current.method)}.` : ""}
        </p>

        {current && fixations.length > 0 && (
          <table className="tool-table">
            <caption>Predicted fixations, in order</caption>
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">x (px)</th>
                <th scope="col">y (px)</th>
                <th scope="col">Salience</th>
              </tr>
            </thead>
            <tbody>
              {fixations.map((f, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{Math.round(f.x * current.source.width)}</td>
                  <td>{Math.round(f.y * current.source.height)}</td>
                  <td>{f.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="tool-panel">
        <fieldset className="tool-group">
          <legend className="tool-label">Model</legend>
          {METHODS.map((m) => (
            <label className="tool-option" key={m.id}>
              <input
                type="radio"
                name="saliency-method"
                value={m.id}
                checked={method === m.id}
                onChange={() => (source ? analyse(source, m.id) : setMethod(m.id))}
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
                <input type="radio" name="saliency-view" value={v.id} checked={view === v.id} onChange={() => setView(v.id)} />
                {v.label}
              </label>
            ))}
          </div>
          <label className={`tool-range${view === "overlay" ? "" : " is-disabled"}`}>
            <span>Overlay strength</span>
            <output>{Math.round(opacity * 100)}%</output>
            <input
              type="range"
              min={0.2}
              max={1}
              step={0.05}
              value={opacity}
              disabled={view !== "overlay"}
              onChange={(event) => setOpacity(Number(event.target.value))}
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
            <input type="checkbox" checked={showFixations} onChange={(event) => setShowFixations(event.target.checked)} />
            Show on image
          </label>
          <label className="tool-range">
            <span>How many</span>
            <output>{fixationCount}</output>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={fixationCount}
              onChange={(event) => setFixationCount(Number(event.target.value))}
            />
          </label>
        </fieldset>

        <div className="tool-group">
          <p className="tool-label">Download</p>
          <div className="tool-downloads">
            <button className="tool-download" type="button" disabled={!current} onClick={downloadMap}>
              Saliency map <span>PNG</span>
            </button>
            <button className="tool-download" type="button" disabled={!current} onClick={downloadView}>
              Current view <span>PNG</span>
            </button>
            <button className="tool-download" type="button" disabled={!current || fixations.length === 0} onClick={downloadFixations}>
              Fixations <span>CSV</span>
            </button>
          </div>
        </div>

        {current && (
          <p className="tool-meta">
            {methodLabel(current.method)} · analysed in {Math.max(1, Math.round(current.ms))} ms
          </p>
        )}
      </div>
    </div>
  );
}
