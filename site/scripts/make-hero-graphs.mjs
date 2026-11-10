// Generates the line artworks for the business and gaming heroes, in the same format as the traced
// brain (assets/data/brain-graph.json), so lib/brainEngine.ts can animate them the same way.
//
//   node scripts/make-hero-graphs.mjs
//
// Format: 665 × 520 artwork space. `verts` are junctions, `edges` are polylines between two verts,
// `nodes` are dots drawn on a vert. A vert with one edge and no node is a root: the intro signal starts there.
// A graph can instead list its `roots` explicitly, and give a `badge` (centre and radius) where the page
// draws the logo.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const W = 665;
const H = 520;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "data");
const round = (v) => Math.round(v * 10) / 10;

function graph() {
  const verts = [];
  const edges = [];
  const nodes = [];
  const vert = ([x, y]) => {
    const i = verts.findIndex(([vx, vy]) => Math.hypot(vx - x, vy - y) < 0.6);
    if (i >= 0) return i;
    verts.push([round(x), round(y)]);
    return verts.length - 1;
  };
  return {
    /** An edge along `points` (first and last points become verts). */
    edge(points) {
      const a = vert(points[0]);
      const b = vert(points[points.length - 1]);
      const p = points.map(([x, y]) => [round(x), round(y)]);
      p[0] = [...verts[a]];
      p[p.length - 1] = [...verts[b]];
      edges.push({ a, b, p });
      return [a, b];
    },
    /** The vert at `point` (created if needed). */
    vertAt: (point) => vert(point),
    node(point, r) {
      const v = vert(point);
      nodes.push({ x: verts[v][0], y: verts[v][1], r, v });
    },
    toJSON: () => ({ w: W, h: H, verts, edges, nodes }),
  };
}

/** A polyline through `pts` with each corner rounded to radius `r` (PCB-style traces). */
function fillet(pts, r = 12) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const d1 = Math.hypot(cx - px, cy - py);
    const d2 = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, d1 / 2, d2 / 2);
    const a = [cx + ((px - cx) / d1) * rr, cy + ((py - cy) / d1) * rr];
    const b = [cx + ((nx - cx) / d2) * rr, cy + ((ny - cy) / d2) * rr];
    out.push(a);
    for (let k = 1; k < 8; k++) {
      const t = k / 8;
      out.push([
        (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * cx + t * t * b[0],
        (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * cy + t * t * b[1],
      ]);
    }
    out.push(b);
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** Samples a chain of cubic Béziers: start point, then [c1, c2, end] triples. */
function cubic(start, ...segments) {
  const out = [start];
  let p0 = start;
  for (const [c1, c2, p3] of segments) {
    const n = Math.max(8, Math.ceil(Math.hypot(p3[0] - p0[0], p3[1] - p0[1]) / 4));
    for (let k = 1; k <= n; k++) {
      const t = k / n;
      const u = 1 - t;
      out.push([
        u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p3[1],
      ]);
    }
    p0 = p3;
  }
  return out;
}

/** An arc around (cx, cy) from angle a0 to a1 (radians, y down). */
function arc(cx, cy, r, a0, a1) {
  const n = Math.max(8, Math.ceil((Math.abs(a1 - a0) * r) / 3));
  return Array.from({ length: n + 1 }, (_, k) => {
    const a = a0 + ((a1 - a0) * k) / n;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
}

// ---------------------------------------------------------------------------------------------
// Home: people connecting around the world. Eight people, linked hand to hand around the edge, each
// also reaching in to a globe in the middle. The intro starts in every head at once and the signals
// meet along the links — many people connecting to build better solutions for the world.

/** A head-and-shoulders figure. Returns its head top (a root) and shoulder ends (where links attach). */
function person(g, [cx, cy], s) {
  const L = local(g, cx, cy, s);
  const top = [0, -12];
  const chin = [0, 12];
  L.arc(0, 0, 12, -Math.PI / 2, Math.PI / 2);
  L.arc(0, 0, 12, Math.PI / 2, (3 * Math.PI) / 2);
  L.curve(chin, [[-11, 13], [-23, 21], [-24, 37]]);
  L.curve(chin, [[11, 13], [23, 21], [24, 37]]);
  const left = L.T([-24, 37]);
  const right = L.T([24, 37]);
  g.node(left, 2.8);
  g.node(right, 2.8);
  return { top: g.vertAt(L.T(top)), left, right };
}

/** A gentle curve from a to b, bowed away from `away` by `bend`. */
function link(g, a, b, away, bend = 26) {
  const d = [b[0] - a[0], b[1] - a[1]];
  const len = Math.hypot(d[0], d[1]);
  let n = [-d[1] / len, d[0] / len];
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  if ((mid[0] - away[0]) * n[0] + (mid[1] - away[1]) * n[1] < 0) n = [-n[0], -n[1]];
  const c1 = [a[0] + d[0] * 0.3 + n[0] * bend, a[1] + d[1] * 0.3 + n[1] * bend];
  const c2 = [a[0] + d[0] * 0.7 + n[0] * bend, a[1] + d[1] * 0.7 + n[1] * bend];
  g.edge(cubic(a, [c1, c2, b]));
}

function home() {
  const g = graph();
  const centre = [332, 262];
  const R = 82;
  const deg = (a) => (a * 180) / Math.PI;
  const rad = (a) => (a * Math.PI) / 180;
  const onGlobe = (a) => [centre[0] + Math.cos(rad(a)) * R, centre[1] + Math.sin(rad(a)) * R];

  // People, clockwise from top left: [head centre, scale]. Slightly different sizes, so it reads as a
  // crowd rather than a pattern.
  const spots = [
    [[92, 96], 1.38],
    [[250, 58], 1.22],
    [[414, 58], 1.28],
    [[572, 100], 1.38],
    [[598, 296], 1.26],
    [[466, 414], 1.38],
    [[204, 420], 1.28],
    [[66, 300], 1.22],
  ];
  const people = spots.map(([pos, s]) => person(g, pos, s));

  // Hand to hand around the ring: each neighbour pair joins at their two closest shoulders.
  const dist = (u, v) => Math.hypot(u[0] - v[0], u[1] - v[1]);
  people.forEach((p, i) => {
    const q = people[(i + 1) % people.length];
    const pairs = [p.left, p.right].flatMap((u) => [q.left, q.right].map((v) => [u, v]));
    const [u, v] = pairs.sort((x, y) => dist(...x) - dist(...y))[0];
    link(g, u, v, centre, 22);
  });

  // Everyone also reaches in to the globe, from the shoulder nearer the centre.
  const globeAngles = [];
  people.forEach((p) => {
    const port = [p.left, p.right].sort(
      (u, v) => Math.hypot(u[0] - centre[0], u[1] - centre[1]) - Math.hypot(v[0] - centre[0], v[1] - centre[1]),
    )[0];
    const a = deg(Math.atan2(port[1] - centre[1], port[0] - centre[0]));
    globeAngles.push(a);
    link(g, port, onGlobe(a), [centre[0], centre[1] - 400], 8);
  });

  // The globe: its outline (split wherever something meets it), an equator, a meridian and two
  // parallels.
  const py = 40;
  const pa = deg(Math.asin(py / R));
  const fixed = [0, 90, 180, 270, -pa, 180 + pa, pa, 180 - pa];
  const angles = [...new Set([...globeAngles, ...fixed].map((a) => Math.round(((a % 360) + 360) % 360 * 10) / 10))].sort(
    (a, b) => a - b,
  );
  angles.forEach((a, i) => {
    const b = i === angles.length - 1 ? angles[0] + 360 : angles[i + 1];
    g.edge(arc(centre[0], centre[1], R, rad(a), rad(b)));
  });
  g.edge([onGlobe(180), onGlobe(0)]);
  g.edge([onGlobe(270), onGlobe(90)]);
  for (const side of [1, -1]) {
    g.edge(
      cubic(onGlobe(270), [
        [centre[0] + side * 46, centre[1] - R],
        [centre[0] + side * 46, centre[1] + R],
        onGlobe(90),
      ]),
    );
  }
  g.edge([onGlobe(180 + pa), onGlobe(-pa)]);
  g.edge([onGlobe(180 - pa), onGlobe(pa)]);

  return { ...g.toJSON(), roots: people.map((p) => p.top) };
}

// ---------------------------------------------------------------------------------------------
// Business: one hub wired out to six industries — tourism, technology, agriculture, healthcare,
// transport and retail — each drawn as a line icon. The intro signal starts in the hub and flows
// out to every industry. The industry names are rendered as HTML labels (see `labels`).

/** Draws in an icon's local coordinates: centre (cx, cy), scale s. */
function local(g, cx, cy, s) {
  const T = ([x, y]) => [cx + x * s, cy + y * s];
  return {
    T,
    edge: (pts) => g.edge(pts.map(T)),
    line: (pts, r = 2.5) => g.edge(fillet(pts.map(T), r * s)),
    curve: (start, ...segs) => g.edge(cubic(T(start), ...segs.map((seg) => seg.map(T)))),
    arc: (x, y, r, a0, a1) => g.edge(arc(cx + x * s, cy + y * s, r * s, a0, a1)),
    node: (pt, r) => g.node(T(pt), r),
    /** An almond-shaped leaf or grain from a to b, `w` wide. */
    leaf(a, b, w, droop = 0) {
      const d = [b[0] - a[0], b[1] - a[1]];
      const len = Math.hypot(d[0], d[1]);
      const n = [-d[1] / len, d[0] / len];
      for (const side of [1, -1]) {
        const k = w * 1.3 * side + droop;
        const c1 = [a[0] + d[0] * 0.3 + n[0] * k, a[1] + d[1] * 0.3 + n[1] * k];
        const c2 = [a[0] + d[0] * 0.7 + n[0] * k, a[1] + d[1] * 0.7 + n[1] * k];
        g.edge(cubic(T(a), [T(c1), T(c2), T(b)]));
      }
    },
  };
}

/** Transport: a delivery truck. Port: top of the cargo box. */
function truck(L) {
  const P = [-13, -24];
  const J = [11, -10];
  const K = [25, -10];
  const M = [37, 2];
  const N = [37, 14];
  const C = [11, 14];
  const D = [-37, 14];
  L.line([P, [-37, -24], D]);
  L.line([P, [11, -24], J]);
  L.edge([J, C]);
  L.line([J, K]);
  L.line([K, M]);
  L.line([M, N]);
  L.line([K, [25, 2], M], 1.5);
  const W1 = [-25, 14];
  const W2 = [25, 14];
  L.edge([D, W1]);
  L.edge([W1, C]);
  L.edge([C, W2]);
  L.edge([W2, N]);
  for (const [x] of [W1, W2]) {
    L.arc(x, 21, 7, -Math.PI / 2, Math.PI / 2);
    L.arc(x, 21, 7, Math.PI / 2, (3 * Math.PI) / 2);
    L.node([x, 28], 2);
  }
  return P;
}

/** Healthcare: a heart with a pulse line. Port: the top cusp. */
function heart(L) {
  const P = [0, -14];
  const l1 = [-36, -6];
  const r1 = [36, -6];
  const tip = [0, 32];
  L.curve(P, [[-8, -30], [-38, -30], l1]);
  L.curve(l1, [[-34, 12], [-12, 22], tip]);
  L.curve(P, [[8, -30], [38, -30], r1]);
  L.curve(r1, [[34, 12], [12, 22], tip]);
  L.line([l1, [-16, -6], [-10, -18], [-3, 10], [4, -14], [9, -6], r1], 1.2);
  return P;
}

/** Retail: a shopping bag. Port: the top of the handle. */
function bag(L) {
  const P = [0, -23];
  const H1 = [-13, -10];
  const H2 = [13, -10];
  const BL = [-30, 30];
  const BR = [30, 30];
  L.arc(0, -10, 13, Math.PI, 1.5 * Math.PI);
  L.arc(0, -10, 13, 1.5 * Math.PI, 2 * Math.PI);
  L.line([H1, [-26, -10], BL], 3);
  L.edge([BL, BR]);
  L.line([BR, [26, -10], H2], 3);
  L.edge([H1, H2]);
  L.node(H1, 2);
  L.node(H2, 2);
  return P;
}

/** Technology: a microchip. Port: the middle pin on the bottom. */
function chip(L) {
  const o = 24;
  const inner = 11;
  const offsets = [-12, 0, 12];
  // Outer edge, clockwise from the top-left corner, with a vert at every pin.
  const ring = (h, withPins) => {
    const pts = [];
    const sides = [
      [[-h, -h], [1, 0]],
      [[h, -h], [0, 1]],
      [[h, h], [-1, 0]],
      [[-h, h], [0, -1]],
    ];
    for (const [[x, y], [dx, dy]] of sides) {
      pts.push([x, y]);
      for (const k of withPins) pts.push([x + dx * (h + k), y + dy * (h + k)]);
    }
    pts.forEach((pt, i) => L.edge([pt, pts[(i + 1) % pts.length]]));
  };
  ring(o, offsets);
  ring(inner, [0]);
  const out = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  for (const [nx, ny] of out) {
    for (const k of offsets) {
      const base = [nx * o + -ny * k, ny * o + nx * k];
      const end = [base[0] + nx * 10, base[1] + ny * 10];
      L.edge([base, end]);
      if (!(k === 0 && ny === 1)) L.node(end, 1.8);
    }
    L.edge([
      [nx * o, ny * o],
      [nx * inner, ny * inner],
    ]);
  }
  return [0, 34];
}

/** Tourism: a palm tree on an island. Port: the middle of the shoreline. */
function palm(L) {
  const P = [0, 28];
  const base = [0, 15];
  const crown = [8, -22];
  L.curve([-30, 28], [[-22, 18], [-10, 15], base]);
  L.curve(base, [[10, 15], [22, 18], [30, 28]]);
  L.edge([[-30, 28], P]);
  L.edge([P, [30, 28]]);
  L.curve(base, [[2, 2], [10, -10], crown]);
  L.leaf(crown, [-22, -16], 5, 3);
  L.leaf(crown, [-10, -40], 4.5, 1);
  L.leaf(crown, [28, -38], 4.5, -1);
  L.leaf(crown, [38, -10], 5, -3);
  L.node(crown, 3);
  return P;
}

/** Agriculture: an ear of wheat. Port: the foot of the stalk. */
function wheat(L) {
  const P = [0, 34];
  const ys = [34, 20, 10, -2, -14, -26];
  for (let i = 0; i < ys.length - 1; i++) L.edge([[0, ys[i]], [0, ys[i + 1]]]);
  L.leaf([0, 20], [22, 2], 4.5, -2);
  L.leaf([0, 10], [-22, -8], 4.5, 2);
  for (const y of [-2, -14, -26]) {
    L.leaf([0, y], [-13, y - 13], 3.6);
    L.leaf([0, y], [13, y - 13], 3.6);
  }
  L.leaf([0, -26], [0, -46], 3.6);
  return P;
}

function business() {
  const g = graph();
  const hub = [332, 258];
  const R = 40;
  const s = 1.15;
  const angle = (deg) => (deg * Math.PI) / 180;
  const onRing = (rad, deg) => [hub[0] + Math.cos(angle(deg)) * rad, hub[1] + Math.sin(angle(deg)) * rad];

  // The hub: a ring around our logo. Every industry is wired to it, and the intro starts here.
  const spokes = [-90, -30, 30, 90, 150, 210];
  const roots = [];
  spokes.forEach((deg, i) => {
    const next = spokes[(i + 1) % spokes.length] + (i === spokes.length - 1 ? 360 : 0);
    g.edge(arc(hub[0], hub[1], R, angle(deg), angle(next)));
    roots.push(g.vertAt(onRing(R, deg)));
  });

  // The industries: [draw, centre, label, ring angle].
  const top = 120;
  const bottom = 400;
  const industries = [
    [palm, [92, top], "Tourism", 210],
    [chip, [332, top], "Technology", -90],
    [wheat, [572, top], "Agriculture", -30],
    [heart, [92, bottom], "Healthcare", 150],
    [truck, [332 + 13 * s, bottom], "Transport", 90],
    [bag, [572, bottom], "Retail", 30],
  ];
  const labels = [];
  for (const [draw, [cx, cy], text, deg] of industries) {
    const L = local(g, cx, cy, s);
    const port = L.T(draw(L));
    const from = onRing(R, deg);
    if (Math.abs(port[0] - from[0]) < 1) {
      g.edge([from, port]);
    } else {
      const dir = [Math.cos(angle(deg)), Math.sin(angle(deg))];
      const out = [from[0] + dir[0] * 24, from[1] + dir[1] * 24];
      g.edge(fillet([from, out, [port[0], out[1]], port], 16));
    }
    g.node(port, 4.2);
    labels.push({ text, x: cy === top ? cx : cx - (draw === truck ? 13 * s : 0), y: cy === top ? 46 : 478 });
  }
  return { ...g.toJSON(), roots, badge: { x: hub[0], y: hub[1], r: 25 }, labels };
}

// ---------------------------------------------------------------------------------------------
// Gaming: a controller in outline, with its buttons wired to a cable — power comes in through the
// cable at the top and lights the controller up.

function gaming() {
  const g = graph();
  const cx = 332;
  const mirror = (pts) => pts.map(([x, y]) => [2 * cx - x, y]).reverse();

  // Outline: the right half as Bézier segments, then the same mirrored.
  const top = [cx, 165];
  const halves = [
    [top, [380, 165], [430, 156], [470, 160]],
    [[470, 160], [515, 164], [550, 178], [562, 202]],
    [[562, 202], [588, 252], [614, 352], [598, 402]],
    [[598, 402], [589, 432], [552, 440], [536, 418]],
    [[536, 418], [516, 390], [500, 356], [470, 351]],
    [[470, 351], [430, 345], [380, 356], [cx, 356]],
  ];
  for (const [p0, c1, c2, p3] of halves) {
    const right = cubic(p0, [c1, c2, p3]);
    g.edge(right);
    g.edge(mirror(right).reverse());
  }
  g.node([470, 160], 3.4);
  g.node([2 * cx - 470, 160], 3.4);

  // Cable from the top of the controller: the only root.
  g.edge(cubic(top, [[cx, 122], [298, 114], [302, 82]], [[306, 50], [348, 54], [346, 18]]));

  // Home button and the internal bus.
  const home = [cx, 212];
  const lower = [cx, 268];
  g.edge([top, home]);
  g.edge([home, lower]);
  g.node(home, 6);

  // D-pad (upper left): a plus-shaped outline, wired in at its right arm.
  const dp = [200, 250];
  const L = 32;
  const w = 12;
  const [x, y] = dp;
  const tips = [
    [x + L, y],
    [x, y + L],
    [x - L, y],
    [x, y - L],
  ];
  const quarter = [
    [[x + L, y], [x + L, y + w], [x + w, y + w], [x + w, y + L], [x, y + L]],
    [[x, y + L], [x - w, y + L], [x - w, y + w], [x - L, y + w], [x - L, y]],
    [[x - L, y], [x - L, y - w], [x - w, y - w], [x - w, y - L], [x, y - L]],
    [[x, y - L], [x + w, y - L], [x + w, y - w], [x + L, y - w], [x + L, y]],
  ];
  quarter.forEach((pts) => g.edge(fillet(pts, 3)));
  tips.forEach((p) => g.node(p, 2.6));
  g.edge(fillet([home, [300, 212], [262, 250], tips[0]], 12));

  // Face buttons (upper right): four buttons on a ring, wired in at the left one.
  const fb = [464, 250];
  const fr = 34;
  const buttons = [0, 1, 2, 3].map((k) => [fb[0] + Math.cos((k * Math.PI) / 2 + Math.PI) * fr, fb[1] + Math.sin((k * Math.PI) / 2 + Math.PI) * fr]);
  for (let k = 0; k < 4; k++) {
    g.edge(arc(fb[0], fb[1], fr, Math.PI + (k * Math.PI) / 2, Math.PI + ((k + 1) * Math.PI) / 2));
  }
  buttons.forEach((p) => g.node(p, 8.5));
  g.edge(fillet([home, [364, 212], [402, 250], buttons[0]], 12));

  // Thumbsticks (lower centre): rings wired in at the top.
  for (const sx of [276, 388]) {
    const sy = 322;
    const r = 24;
    g.edge(arc(sx, sy, r, -Math.PI / 2, Math.PI / 2));
    g.edge(arc(sx, sy, r, Math.PI / 2, (3 * Math.PI) / 2));
    // A stem from the ring down to the cap in the middle.
    g.edge([[sx, sy - r], [sx, sy - 9]]);
    g.edge(arc(sx, sy, 9, -Math.PI / 2, Math.PI / 2));
    g.edge(arc(sx, sy, 9, Math.PI / 2, (3 * Math.PI) / 2));
    g.node([sx, sy - r], 3);
    const dir = Math.sign(sx - cx);
    g.edge(fillet([lower, [sx - dir * 12, lower[1]], [sx, lower[1] + 12], [sx, sy - r]], 8));
  }
  return g.toJSON();
}

for (const [name, data] of [
  ["home-graph.json", home()],
  ["business-graph.json", business()],
  ["gaming-graph.json", gaming()],
]) {
  writeFileSync(join(OUT, name), JSON.stringify(data));
  console.log(`${name}: ${data.verts.length} verts, ${data.edges.length} edges, ${data.nodes.length} nodes`);
}
