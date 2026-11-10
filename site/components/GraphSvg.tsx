import type { RawGraph } from "@/lib/brainEngine";

/** The graph's lines and nodes as a static SVG: the no-JavaScript fallback, and the art on the landing page's cards. */
export default function GraphSvg({ graph, className = "graph-svg" }: { graph: RawGraph; className?: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${graph.w} ${graph.h}`} aria-hidden="true" focusable="false">
      <path d={graph.edges.map((e) => `M${e.p.map(([x, y]) => `${x} ${y}`).join("L")}`).join("")} />
      {graph.nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} />
      ))}
    </svg>
  );
}
