"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fitSize, predictFixations } from "@/lib/saliency";
import { drawComposite, mapLayers, saveBlob } from "@/lib/saliencyRender";
import { colourPopout, noPopout, orientationPopout } from "@/lib/saliencyStimuli";
import {
  FIXATION_RADIUS,
  SettingsPanel,
  SourceError,
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

const MAX_IMAGES = 12;
const KEEP_MAX = 1280; // compared images are kept at most this size, to limit memory
const CARD_SIZE = 640; // longest side of each card's canvas
const CARD_MARKER_SCALE = 2; // cards show at about a third of CARD_SIZE, so fixation markers are drawn larger

const SAMPLE_SET = [
  { label: "Colour pop-out", make: () => colourPopout().image },
  { label: "Orientation pop-out", make: () => orientationPopout().image },
  { label: "No odd item", make: () => noPopout().image },
];

type Item = { id: number; source: Source; result: Result | null };
type SortKey = "added" | "standout" | "area";

const SORTS: readonly { id: SortKey; label: string }[] = [
  { id: "added", label: "Order added" },
  { id: "standout", label: "Stands out most" },
  { id: "area", label: "Most spread out" },
];

type Props = {
  settings: Settings;
  onSettings: (next: Settings) => void;
  onOpen: (source: Source, result: Result | null) => void;
};

export default function CompareView({ settings, onSettings, onOpen }: Props) {
  const { method } = settings;
  const [items, setItems] = useState<Item[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [sort, setSort] = useState<SortKey>("added");
  const fileRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);

  const isFresh = (item: Item) => item.result?.method === method;

  // Analyse one image at a time, so the page stays responsive and progress shows as each one finishes.
  useEffect(() => {
    const next = items.find((item) => item.result?.method !== method);
    if (!next) return;
    const id = window.setTimeout(() => {
      const result = analyse(next.source, method);
      setItems((all) => all.map((item) => (item.id === next.id ? { ...item, result } : item)));
    }, 30);
    return () => window.clearTimeout(id);
  }, [items, method]);

  const add = (sources: Source[]) => {
    setItems((all) => [...all, ...sources.map((source) => ({ id: ++nextId.current, source, result: null }))].slice(0, MAX_IMAGES));
  };

  const addFiles = async (files: File[]) => {
    const room = MAX_IMAGES - items.length;
    const accepted = files.slice(0, Math.max(0, room));
    const failed: string[] = [];
    const sources: Source[] = [];
    for (const file of accepted) {
      try {
        sources.push(await sourceFromFile(file, KEEP_MAX));
      } catch (e) {
        failed.push(e instanceof SourceError ? file.name : `${file.name} (unexpected error)`);
      }
    }
    add(sources);
    const messages: string[] = [];
    if (failed.length) messages.push(`Couldn’t open ${failed.join(", ")}. Use JPEG, PNG, WebP or GIF images.`);
    if (files.length > accepted.length) messages.push(`Up to ${MAX_IMAGES} images can be compared at once, so ${files.length - accepted.length} were left out.`);
    setNotice(messages.length ? messages.join(" ") : null);
  };

  const remove = (id: number) => setItems((all) => all.filter((item) => item.id !== id));

  const ordered = useMemo(() => {
    if (sort === "added") return items;
    // Images still being analysed, or with nothing salient, go last.
    const score = (item: Item) => {
      const summary = item.result?.method === method ? item.result.summary : null;
      if (!summary) return -Infinity;
      return sort === "standout" ? summary.standout : summary.salientArea;
    };
    return [...items].sort((a, b) => score(b) - score(a));
  }, [items, sort, method]);

  const pending = items.filter((item) => !isFresh(item)).length;
  const done = items.length - pending;

  const downloadCsv = () => {
    const rows = ordered.map((item) => {
      const summary = isFresh(item) ? item.result!.summary : null;
      const cells = [
        item.source.name,
        item.source.width,
        item.source.height,
        methodLabel(method),
        summary ? summary.standout.toFixed(3) : "",
        summary ? summary.salientArea.toFixed(4) : "",
        summary ? Math.round(summary.peak.x * item.source.width) : "",
        summary ? Math.round(summary.peak.y * item.source.height) : "",
      ];
      return cells.map((cell) => (/[",\n]/.test(String(cell)) ? `"${String(cell).replace(/"/g, '""')}"` : cell)).join(",");
    });
    const csv = ["image,width_px,height_px,model,standout,salient_area,peak_x_px,peak_y_px", ...rows].join("\n") + "\n";
    saveBlob(new Blob([csv], { type: "text/csv" }), `saliency-comparison-${method}.csv`);
  };

  return (
    <div className="tool">
      <div className="tool-main">
        <div className="tool-toolbar">
          <button className="button-primary" type="button" onClick={() => fileRef.current?.click()} disabled={items.length >= MAX_IMAGES}>
            {items.length ? "Add more images" : "Add images"}
          </button>
          <input
            ref={fileRef}
            className="visually-hidden"
            type="file"
            accept="image/*"
            multiple
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              addFiles(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
          />
          {items.length === 0 ? (
            <div className="tool-samples">
              <span>Or try a sample set:</span>
              <button
                className="tool-chip"
                type="button"
                onClick={() => add(SAMPLE_SET.map((sample) => sampleSource(sample.label, sample.make())))}
              >
                Three search displays
              </button>
            </div>
          ) : (
            <div className="tool-compare-actions">
              <label className="tool-select">
                <span>Sort</span>
                <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <button className="tool-chip" type="button" onClick={() => setItems([])}>
                Clear all
              </button>
            </div>
          )}
        </div>

        <div
          className={`tool-dropzone${items.length ? " has-images" : ""}${dragging ? " is-dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            addFiles(Array.from(event.dataTransfer.files));
          }}
        >
          {items.length === 0 ? (
            <div className="tool-empty">
              <p className="tool-empty-title">Drop several images here</p>
              <p>Up to {MAX_IMAGES}, analysed with the same model and shown side by side.</p>
            </div>
          ) : (
            <ul className="compare-grid" role="list">
              {ordered.map((item) => (
                <CompareCard
                  key={item.id}
                  item={item}
                  settings={settings}
                  onRemove={() => remove(item.id)}
                  onOpen={() => onOpen(item.source, isFresh(item) ? item.result : null)}
                />
              ))}
            </ul>
          )}
        </div>

        {notice && (
          <p className="tool-error" role="alert">
            {notice}
          </p>
        )}
        <p className="tool-readout" role="status">
          {pending > 0 ? `Analysing ${done + 1} of ${items.length}…` : items.length ? `${items.length} ${items.length === 1 ? "image" : "images"} compared with ${methodLabel(method)}.` : ""}
        </p>
        <p className="tool-privacy">Your images stay on your device. They’re analysed in your browser and never uploaded.</p>

        {items.length > 0 && (
          <>
            <table className="tool-table compare-table">
              <caption>Comparison, {methodLabel(method)}</caption>
              <thead>
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Standout</th>
                  <th scope="col">Salient area</th>
                  <th scope="col">Peak (x, y px)</th>
                </tr>
              </thead>
              <tbody>
                {ordered.map((item) => {
                  const fresh = isFresh(item);
                  const summary = fresh ? item.result!.summary : null;
                  const empty = fresh ? "Nothing salient" : "Analysing…";
                  return (
                    <tr key={item.id}>
                      <td className="compare-name">{item.source.name}</td>
                      <td>{summary ? formatStandout(summary.standout) : empty}</td>
                      <td>{summary ? formatArea(summary.salientArea) : "–"}</td>
                      <td>
                        {summary
                          ? `${Math.round(summary.peak.x * item.source.width)}, ${Math.round(summary.peak.y * item.source.height)}`
                          : "–"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="compare-note">
              <strong>Standout</strong> is how many times more salient an image’s peak is than the next-best spot
              elsewhere in it: about 1× when several spots compete, higher when one clearly wins.{" "}
              <strong>Salient area</strong> is the share of the image at least half as salient as its peak. Each map is
              scaled to its own image, so these compare how attention is distributed within each image, not which image
              is more eye-catching overall.
            </p>
          </>
        )}
      </div>

      <SettingsPanel settings={settings} onChange={onSettings} name="compare">
        <div className="tool-group">
          <p className="tool-label">Download</p>
          <div className="tool-downloads">
            <button className="tool-download" type="button" disabled={items.length === 0 || pending > 0} onClick={downloadCsv}>
              Comparison <span>CSV</span>
            </button>
          </div>
        </div>
      </SettingsPanel>
    </div>
  );
}

function CompareCard({ item, settings, onRemove, onOpen }: { item: Item; settings: Settings; onRemove: () => void; onOpen: () => void }) {
  const { method, view, opacity, showFixations, fixationCount } = settings;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { source, result } = item;
  const fresh = result?.method === method;

  // Until the new model finishes, keep showing the last map for this image.
  const layers = useMemo(() => (result ? mapLayers(result.map) : null), [result]);
  const fixations = useMemo(
    () => (result && showFixations ? predictFixations(result.map, fixationCount, FIXATION_RADIUS) : []),
    [result, showFixations, fixationCount],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const [w, h] = fitSize(source.width, source.height, CARD_SIZE);
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    if (layers) {
      drawComposite(ctx, w, h, source.image, layers, {
        view,
        opacity,
        fixations,
        fontFamily: getComputedStyle(canvas).fontFamily,
        markerScale: CARD_MARKER_SCALE,
      });
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(source.image, 0, 0, w, h);
    }
  }, [source, layers, view, opacity, fixations]);

  const summary = fresh ? result.summary : null;

  return (
    <li className="compare-card">
      <div className="compare-frame">
        <canvas ref={canvasRef} className="compare-canvas" role="img" aria-label={`${source.name}, ${view === "map" ? "heatmap" : view} view`} />
        {!fresh && <p className="tool-busy">Analysing…</p>}
      </div>
      <div className="compare-body">
        <p className="compare-title" title={source.name}>
          {source.name}
        </p>
        <dl className="compare-stats">
          <div>
            <dt>Standout</dt>
            <dd>{summary ? formatStandout(summary.standout) : fresh ? "–" : "…"}</dd>
          </div>
          <div>
            <dt>Salient area</dt>
            <dd>{summary ? formatArea(summary.salientArea) : fresh ? "–" : "…"}</dd>
          </div>
        </dl>
        <div className="compare-actions">
          <button className="compare-link" type="button" onClick={onOpen}>
            Open
          </button>
          <button className="compare-link" type="button" onClick={onRemove} aria-label={`Remove ${source.name}`}>
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
