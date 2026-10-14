"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fitSize, predictFixations } from "@/lib/saliency";
import { drawComposite, fixationsCsv, mapLayers, saveBlob, saveCanvas } from "@/lib/saliencyRender";
import { colourPopout, orientationPopout } from "@/lib/saliencyStimuli";
import {
  FIXATION_RADIUS,
  SettingsPanel,
  SourceError,
  VIEWS,
  analyse,
  formatArea,
  formatStandout,
  methodLabel,
  sampleSource,
  sourceFromFile,
  type Result,
  type Settings,
  type Source,
} from "./shared";

const DISPLAY_MIN = 800; // the on-screen canvas is drawn at 800–1600 px on its longest side
const DISPLAY_MAX = 1600;
const EXPORT_MAX = 4096; // downloads match the original image, up to this size

const SAMPLES = [
  { label: "Colour pop-out", make: () => colourPopout().image },
  { label: "Orientation pop-out", make: () => orientationPopout().image },
];

type Props = {
  settings: Settings;
  onSettings: (next: Settings) => void;
  source: Source | null;
  onSource: (source: Source) => void;
  result: Result | null;
  onResult: (result: Result) => void;
};

export default function SingleView({ settings, onSettings, source, onSource, result, onResult }: Props) {
  const { method, view, opacity, showFixations, fixationCount } = settings;
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState<{ value: number; percent: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Analyse whenever the image or model changes. The timeout lets the "Analysing" state paint first.
  // (Not requestAnimationFrame: it never fires in a background tab, which would stall the analysis.)
  const fresh = result && result.source === source && result.method === method ? result : null;
  useEffect(() => {
    if (!source || fresh) return;
    const id = window.setTimeout(() => onResult(analyse(source, method)), 30);
    return () => window.clearTimeout(id);
  }, [source, method, fresh, onResult]);

  // While a new model runs, keep showing the previous map for the same image.
  const shown = result && result.source === source ? result : null;
  const busy = !!source && !fresh;

  const layers = useMemo(() => (shown ? mapLayers(shown.map) : null), [shown]);
  const fixations = useMemo(() => (shown ? predictFixations(shown.map, fixationCount, FIXATION_RADIUS) : []), [shown, fixationCount]);
  const shownFixations = useMemo(() => (showFixations ? fixations : []), [showFixations, fixations]);

  const choose = (next: Source) => {
    setError(null);
    setHover(null);
    onSource(next);
  };

  const openFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      choose(await sourceFromFile(file));
    } catch (e) {
      setError(e instanceof SourceError ? e.message : "That image couldn’t be opened.");
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
    if (!shown) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const { map, sorted } = shown;
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
    `${(source?.name ?? "image").replace(/\.[^.]+$/, "")}-${suffix}-${shown?.method ?? method}`;

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
  else if (shown && fixations.length === 0) readout = "Nothing stands out in this image: it has no contrast to work with.";
  else if (shown) readout = "Point at the image to read the salience at any spot (0 = least, 1 = most).";

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
              <button key={sample.label} className="tool-chip" type="button" onClick={() => choose(sampleSource(sample.label, sample.make()))}>
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
          {busy ? "Analysing image…" : fresh ? `Saliency map ready, using ${methodLabel(fresh.method)}.` : ""}
        </p>

        {shown && fixations.length > 0 && (
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
                  <td>{Math.round(f.x * shown.source.width)}</td>
                  <td>{Math.round(f.y * shown.source.height)}</td>
                  <td>{f.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <SettingsPanel settings={settings} onChange={onSettings} name="single">
        {shown?.summary && (
          <div className="tool-group">
            <p className="tool-label">Summary</p>
            <dl className="tool-stats">
              <div>
                <dt>Standout</dt>
                <dd>{formatStandout(shown.summary.standout)}</dd>
              </div>
              <div>
                <dt>Salient area</dt>
                <dd>{formatArea(shown.summary.salientArea)}</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="tool-group">
          <p className="tool-label">Download</p>
          <div className="tool-downloads">
            <button className="tool-download" type="button" disabled={!fresh} onClick={downloadMap}>
              Saliency map <span>PNG</span>
            </button>
            <button className="tool-download" type="button" disabled={!fresh} onClick={downloadView}>
              Current view <span>PNG</span>
            </button>
            <button className="tool-download" type="button" disabled={!fresh || fixations.length === 0} onClick={downloadFixations}>
              Fixations <span>CSV</span>
            </button>
          </div>
        </div>

        {fresh && (
          <p className="tool-meta">
            {methodLabel(fresh.method)} · analysed in {Math.max(1, Math.round(fresh.ms))} ms
          </p>
        )}
      </SettingsPanel>
    </div>
  );
}
