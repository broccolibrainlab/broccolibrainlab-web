"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import { mountBrain, readCssPalette, type RawGraph } from "@/lib/brainEngine";
import LogoMark from "./LogoMark";

type HeroGraphProps = {
  graph: RawGraph;
  /** Static artwork for visitors without JavaScript. Without one, the graph itself is drawn as SVG. */
  fallback?: StaticImageData;
};

/** The graph's lines and nodes as a static SVG, used as the no-JavaScript fallback. */
function GraphSvg({ graph }: { graph: RawGraph }) {
  return (
    <svg className="graph-svg" viewBox={`0 0 ${graph.w} ${graph.h}`} aria-hidden="true" focusable="false">
      <path d={graph.edges.map((e) => `M${e.p.map(([x, y]) => `${x} ${y}`).join("L")}`).join("")} />
      {graph.nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} />
      ))}
    </svg>
  );
}

// The artwork is drawn on a canvas in the page's accent colours. The static version lives in <noscript>
// so it only appears for visitors without JavaScript and is never shown alongside the canvas.
export default function HeroGraph({ graph, fallback }: HeroGraphProps) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handle = mountBrain(el, graph, mq.matches, readCssPalette(el));
    if (!handle) return;
    const onChange = () => handle.setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      handle.destroy();
    };
  }, [graph]);

  return (
    <div className="hero-art brain-art" aria-hidden="true" style={{ aspectRatio: `${graph.w} / ${graph.h}` }}>
      <canvas ref={canvas} className="brain-canvas" />
      <noscript>{fallback ? <Image src={fallback} alt="" loading="eager" /> : <GraphSvg graph={graph} />}</noscript>
      {graph.badge && (
        <span
          className="graph-badge"
          style={{
            left: `${(graph.badge.x / graph.w) * 100}%`,
            top: `${(graph.badge.y / graph.h) * 100}%`,
            width: `${((graph.badge.r * 2) / graph.w) * 100}%`,
          }}
        >
          <LogoMark size={64} />
        </span>
      )}
      {graph.labels?.map((label) => (
        <span
          className="graph-label"
          key={label.text}
          style={{ left: `${(label.x / graph.w) * 100}%`, top: `${(label.y / graph.h) * 100}%` }}
        >
          {label.text}
        </span>
      ))}
    </div>
  );
}
