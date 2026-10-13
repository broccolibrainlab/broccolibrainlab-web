/*
 * Interactive neuron-tree animation for the hero.
 *
 * The geometry comes from tracing the approved hero artwork (assets/data/brain-graph.json),
 * so every pulse travels along the real curves of the drawing. Coordinates are in the
 * artwork's own 665 × 520 space; the canvas is scaled to fit.
 *
 *  - On load a signal climbs from the trunk and draws the branches in as it goes.
 *  - Afterwards, quiet pulses wander up the branches and fire the nodes they reach.
 *  - Pointer: nearby branches glow, the drawing tilts a few pixels, nodes swell.
 *  - Click / tap: a node fires and a wave floods the whole network; anywhere else
 *    sends a pulse both ways along the nearest branch.
 */

export interface RawGraph {
  w: number;
  h: number;
  verts: number[][];
  edges: { a: number; b: number; p: number[][] }[];
  nodes: { x: number; y: number; r: number; v: number }[];
}

export type RGB = readonly [number, number, number];

/** Line and node colours. Defaults mirror --sage / --sage-bright; prefer readCssPalette(). */
export interface Palette {
  sage: RGB;
  bright: RGB;
}

const DEFAULT_PALETTE: Palette = { sage: [164, 199, 174], bright: [182, 214, 186] };
const HOT: RGB = [226, 248, 230]; // highlight for firing pulses; not a page colour

const hexToRgb = (hex: string): RGB | null => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};

/** Reads the brand colours from the page's CSS custom properties so the palette has one source. */
export function readCssPalette(): Palette {
  const style = getComputedStyle(document.documentElement);
  return {
    sage: hexToRgb(style.getPropertyValue("--sage")) ?? DEFAULT_PALETTE.sage,
    bright: hexToRgb(style.getPropertyValue("--sage-bright")) ?? DEFAULT_PALETTE.bright,
  };
}

const LINE_WIDTH = 1.55;
const STEP = 3; // resample spacing in artwork pixels
const MAX_SIGNALS = 160;

const INTRO_SPEED = 330;
const BURST_SPEED = 330;
const AMBIENT_SPEED = 175;

const GLOW_RADIUS = 96;
const TILT = 4;
const NODE_HIT = 24;
const EDGE_HIT = 46;

interface Edge {
  a: number;
  b: number;
  x: number[];
  y: number[];
  cum: number[];
  len: number;
  /** distance revealed from the first / last point (intro draw-in) */
  revA: number;
  revB: number;
}

interface Burst {
  visited: Set<number>;
  live: number;
  decay: boolean;
  intro: boolean;
}

interface Signal {
  e: number;
  dir: 1 | -1;
  s: number;
  speed: number;
  tail: number;
  strength: number;
  hops: number;
  arrived: boolean;
  burst: Burst | null;
  visited: Set<number> | null; // ambient pulses avoid retracing edges
}

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeOutBack = (t: number) => {
  const c1 = 1.9;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

function buildEdge(raw: RawGraph["edges"][number]): Edge {
  const x: number[] = [raw.p[0][0]];
  const y: number[] = [raw.p[0][1]];
  const cum: number[] = [0];
  for (let i = 1; i < raw.p.length; i++) {
    const [x0, y0] = raw.p[i - 1];
    const [x1, y1] = raw.p[i];
    const d = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.max(1, Math.ceil(d / STEP));
    for (let k = 1; k <= n; k++) {
      const nx = x0 + ((x1 - x0) * k) / n;
      const ny = y0 + ((y1 - y0) * k) / n;
      cum.push(cum[cum.length - 1] + Math.hypot(nx - x[x.length - 1], ny - y[y.length - 1]));
      x.push(nx);
      y.push(ny);
    }
  }
  return { a: raw.a, b: raw.b, x, y, cum, len: cum[cum.length - 1], revA: 0, revB: 0 };
}

export interface BrainHandle {
  setReduced(reduced: boolean): void;
  destroy(): void;
}

export function mountBrain(
  canvas: HTMLCanvasElement,
  raw: RawGraph,
  reducedInitially: boolean,
  palette: Palette = DEFAULT_PALETTE,
): BrainHandle | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const host = canvas.parentElement as HTMLElement;
  const { sage: SAGE, bright: BRIGHT } = palette;

  const W = raw.w;
  const H = raw.h;
  const edges = raw.edges.map(buildEdge);
  const nodes = raw.nodes;
  const vEdges: number[][] = raw.verts.map(() => []);
  edges.forEach((e, i) => {
    vEdges[e.a].push(i);
    vEdges[e.b].push(i);
  });
  const nodeAtVertex = new Map<number, number>();
  nodes.forEach((n, i) => {
    if (n.v >= 0) nodeAtVertex.set(n.v, i);
  });
  const roots: number[] = [];
  vEdges.forEach((list, v) => {
    if (list.length === 1 && !nodeAtVertex.has(v)) roots.push(v);
  });

  // ---- geometry helpers -------------------------------------------------
  const idxAt = (e: Edge, d: number) => {
    let lo = 0;
    let hi = e.cum.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (e.cum[mid] <= d) lo = mid;
      else hi = mid;
    }
    return lo;
  };
  const pointAt = (e: Edge, d: number): [number, number] => {
    d = clamp(d, 0, e.len);
    const i = idxAt(e, d);
    const span = e.cum[i + 1] - e.cum[i] || 1;
    const t = (d - e.cum[i]) / span;
    return [e.x[i] + (e.x[i + 1] - e.x[i]) * t, e.y[i] + (e.y[i + 1] - e.y[i]) * t];
  };
  const tracePart = (e: Edge, d0: number, d1: number) => {
    if (d0 > d1) [d0, d1] = [d1, d0];
    d0 = clamp(d0, 0, e.len);
    d1 = clamp(d1, 0, e.len);
    const [sx, sy] = pointAt(e, d0);
    ctx.moveTo(sx, sy);
    const i0 = idxAt(e, d0) + 1;
    const i1 = idxAt(e, d1);
    for (let i = i0; i <= i1; i++) ctx.lineTo(e.x[i], e.y[i]);
    const [ex, ey] = pointAt(e, d1);
    ctx.lineTo(ex, ey);
  };

  // ---- state ------------------------------------------------------------
  let reduced = reducedInitially;
  let running = false;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let introDone = reduced;
  let nextAmbient = 0;
  let size = { cssW: 0, cssH: 0, k: 1 };
  const signals: Signal[] = [];
  const act: number[] = nodes.map(() => 0); // flare, decays
  const pop: number[] = nodes.map(() => (reduced ? 1 : -1)); // <0: not yet revealed
  const hoverAmt: number[] = nodes.map(() => 0);
  const pointer = { x: -999, y: -999, inside: false, influence: 0 };
  let tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  let hoverNode = -1;
  let restPath: Path2D | null = null;

  const fullyReveal = () => {
    edges.forEach((e) => {
      e.revA = e.len;
      e.revB = e.len;
    });
  };
  if (reduced) fullyReveal();

  const buildRestPath = () => {
    const p = new Path2D();
    edges.forEach((e) => {
      p.moveTo(e.x[0], e.y[0]);
      for (let i = 1; i < e.x.length; i++) p.lineTo(e.x[i], e.y[i]);
    });
    restPath = p;
  };

  // ---- signals ----------------------------------------------------------
  const newBurst = (decay: boolean, intro = false): Burst => ({ visited: new Set(), live: 0, decay, intro });

  const spawn = (s: Omit<Signal, "arrived">) => {
    if (signals.length >= MAX_SIGNALS) return;
    signals.push({ ...s, arrived: false });
    if (s.burst) s.burst.live++;
  };

  const enter = (v: number, e: number, p: Partial<Signal> & { speed: number; strength: number; hops: number }, burst: Burst | null) => {
    const edge = edges[e];
    const dir: 1 | -1 = edge.a === v ? 1 : -1;
    spawn({
      e,
      dir,
      s: 0,
      tail: 40,
      burst,
      visited: burst ? null : p.visited ?? new Set([e]),
      speed: p.speed,
      strength: p.strength,
      hops: p.hops,
    });
  };

  const activate = (n: number, strength: number) => {
    act[n] = Math.max(act[n], strength);
    if (pop[n] < 0) pop[n] = 0;
  };

  const exitVertex = (sig: Signal) => (sig.dir === 1 ? edges[sig.e].b : edges[sig.e].a);

  const heading = (e: Edge, dir: 1 | -1, atEnd: boolean) => {
    // unit vector of travel at the start (atEnd=false) or end (atEnd=true) of a pass along e
    const n = e.x.length - 1;
    const k = Math.min(4, n);
    let dx: number;
    let dy: number;
    if ((dir === 1) !== atEnd) {
      dx = e.x[k] - e.x[0];
      dy = e.y[k] - e.y[0];
      if (dir === -1) {
        dx = -dx;
        dy = -dy;
      }
    } else {
      dx = e.x[n] - e.x[n - k];
      dy = e.y[n] - e.y[n - k];
      if (dir === -1) {
        dx = -dx;
        dy = -dy;
      }
    }
    const m = Math.hypot(dx, dy) || 1;
    return [dx / m, dy / m] as const;
  };

  const onArrive = (sig: Signal) => {
    const v = exitVertex(sig);
    const node = nodeAtVertex.get(v);
    if (node !== undefined) activate(node, Math.min(1, sig.strength + 0.15));

    if (sig.burst) {
      const b = sig.burst;
      for (const e2 of vEdges[v]) {
        if (b.visited.has(e2)) continue;
        b.visited.add(e2);
        const strength = b.decay ? Math.max(0.32, sig.strength - 0.07) : sig.strength;
        enter(v, e2, { speed: sig.speed, strength, hops: sig.hops + 1 }, b);
      }
      return;
    }

    // ambient pulse: pick one way on, preferring to keep going and to climb
    if (sig.hops > 16 || !sig.visited) return;
    const [hx, hy] = heading(edges[sig.e], sig.dir, true);
    let best = -1;
    let bestScore = -Infinity;
    for (const e2 of vEdges[v]) {
      if (sig.visited.has(e2)) continue;
      const edge = edges[e2];
      const dir2: 1 | -1 = edge.a === v ? 1 : -1;
      const [ox, oy] = heading(edge, dir2, false);
      const far = dir2 === 1 ? edge.y[edge.y.length - 1] : edge.y[0];
      const near = dir2 === 1 ? edge.y[0] : edge.y[edge.y.length - 1];
      const score = hx * ox + hy * oy + clamp((near - far) / 160, -0.4, 0.4) + Math.random() * 0.7;
      if (score > bestScore) {
        bestScore = score;
        best = e2;
      }
    }
    if (best >= 0) {
      sig.visited.add(best);
      enter(v, best, { speed: sig.speed, strength: sig.strength * 0.97, hops: sig.hops + 1, visited: sig.visited }, null);
    }
  };

  const startIntro = () => {
    const burst = newBurst(false, true);
    roots.forEach((v) => {
      const e = vEdges[v][0];
      burst.visited.add(e);
      enter(v, e, { speed: INTRO_SPEED, strength: 1, hops: 0 }, burst);
    });
  };

  const ambientPulse = () => {
    const fromNode = Math.random() < 0.3;
    let v: number;
    if (fromNode) v = nodes[Math.floor(Math.random() * nodes.length)].v;
    else v = roots[Math.floor(Math.random() * roots.length)];
    if (v === undefined || v < 0) return;
    const e = vEdges[v][0];
    enter(v, e, { speed: AMBIENT_SPEED * (0.85 + Math.random() * 0.35), strength: 0.9, hops: 0, visited: new Set([e]) }, null);
  };

  const fireNode = (n: number) => {
    const node = nodes[n];
    activate(n, 1);
    act[n] = 1;
    const burst = newBurst(true);
    const e = vEdges[node.v][0];
    burst.visited.add(e);
    enter(node.v, e, { speed: BURST_SPEED, strength: 1, hops: 0 }, burst);
  };

  const poke = (px: number, py: number) => {
    let bestD = EDGE_HIT;
    let bestE = -1;
    let bestPos = 0;
    edges.forEach((e, ei) => {
      for (let i = 0; i < e.x.length - 1; i++) {
        const x0 = e.x[i];
        const y0 = e.y[i];
        const dx = e.x[i + 1] - x0;
        const dy = e.y[i + 1] - y0;
        const L2 = dx * dx + dy * dy || 1;
        const t = clamp(((px - x0) * dx + (py - y0) * dy) / L2, 0, 1);
        const d = Math.hypot(px - (x0 + dx * t), py - (y0 + dy * t));
        if (d < bestD) {
          bestD = d;
          bestE = ei;
          bestPos = e.cum[i] + t * Math.sqrt(L2);
        }
      }
    });
    if (bestE < 0) return;
    const e = edges[bestE];
    const burst = newBurst(true);
    burst.visited.add(bestE);
    const common = { tail: 44, burst, visited: null, speed: BURST_SPEED, strength: 1, hops: 0 };
    spawn({ e: bestE, dir: 1, s: bestPos, ...common });
    spawn({ e: bestE, dir: -1, s: e.len - bestPos, ...common });
  };

  // ---- update -----------------------------------------------------------
  const update = (dt: number) => {
    clock += dt;

    for (let i = signals.length - 1; i >= 0; i--) {
      const sig = signals[i];
      const e = edges[sig.e];
      sig.s += sig.speed * dt;
      if (!introDone) {
        const front = Math.min(sig.s, e.len);
        if (sig.dir === 1) e.revA = Math.max(e.revA, front);
        else e.revB = Math.max(e.revB, front);
      }
      if (!sig.arrived && sig.s >= e.len) {
        sig.arrived = true;
        onArrive(sig);
      }
      if (sig.s - sig.tail >= e.len) {
        if (sig.burst) sig.burst.live--;
        signals.splice(i, 1);
        if (sig.burst?.intro && sig.burst.live === 0) {
          introDone = true;
          fullyReveal();
          nextAmbient = clock + 0.6;
        }
      }
    }

    if (introDone && !reduced && clock >= nextAmbient && signals.length < 40) {
      ambientPulse();
      nextAmbient = clock + 0.55 + Math.random() * 1.1;
    }

    for (let i = 0; i < nodes.length; i++) {
      act[i] = Math.max(0, act[i] - dt * 1.1);
      if (pop[i] >= 0 && pop[i] < 1) pop[i] = Math.min(1, pop[i] + dt * 3);
      hoverAmt[i] += ((hoverNode === i ? 1 : 0) - hoverAmt[i]) * Math.min(1, dt * 12);
    }
    pointer.influence += ((pointer.inside ? 1 : 0) - pointer.influence) * Math.min(1, dt * 6);
    tilt.x += (tilt.tx - tilt.x) * Math.min(1, dt * 4);
    tilt.y += (tilt.ty - tilt.y) * Math.min(1, dt * 4);
  };

  // ---- draw -------------------------------------------------------------
  const drawRest = () => {
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = rgba(SAGE, 0.94);
    if (introDone) {
      if (!restPath) buildRestPath();
      ctx.stroke(restPath!);
      return;
    }
    ctx.beginPath();
    for (const e of edges) {
      if (e.revA > 0.5) tracePart(e, 0, e.revA);
      if (e.revB > 0.5) tracePart(e, e.len - e.revB, e.len);
    }
    ctx.stroke();
  };

  const drawProximity = () => {
    if (pointer.influence < 0.02) return;
    const R = GLOW_RADIUS;
    ctx.lineWidth = LINE_WIDTH + 0.7;
    ctx.lineCap = "round";
    for (const e of edges) {
      for (let i = 0; i < e.x.length - 1; i++) {
        const mx = (e.x[i] + e.x[i + 1]) / 2 - pointer.x;
        if (mx > R || mx < -R) continue;
        const my = (e.y[i] + e.y[i + 1]) / 2 - pointer.y;
        const d = Math.hypot(mx, my);
        if (d > R) continue;
        const f = 1 - d / R;
        ctx.strokeStyle = rgba(HOT, f * f * 0.85 * pointer.influence);
        ctx.beginPath();
        ctx.moveTo(e.x[i], e.y[i]);
        ctx.lineTo(e.x[i + 1], e.y[i + 1]);
        ctx.stroke();
      }
    }
  };

  const drawSignals = () => {
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    for (const sig of signals) {
      const e = edges[sig.e];
      const head = clamp(sig.s, 0, e.len);
      const tailS = clamp(sig.s - sig.tail, 0, e.len);
      if (head - tailS < 0.6) continue;
      const g0 = sig.dir === 1 ? tailS : e.len - tailS;
      const g1 = sig.dir === 1 ? head : e.len - head;
      const [tx, ty] = pointAt(e, g0);
      const [hx, hy] = pointAt(e, g1);
      const grad = ctx.createLinearGradient(tx, ty, hx, hy);
      const a = sig.strength;
      grad.addColorStop(0, rgba(BRIGHT, 0));
      grad.addColorStop(1, rgba(HOT, a));
      const wide = ctx.createLinearGradient(tx, ty, hx, hy);
      wide.addColorStop(0, rgba(SAGE, 0));
      wide.addColorStop(1, rgba(BRIGHT, a * 0.28));
      ctx.beginPath();
      tracePart(e, g0, g1);
      ctx.lineWidth = 6;
      ctx.strokeStyle = wide;
      ctx.stroke();
      ctx.lineWidth = LINE_WIDTH + 0.9;
      ctx.strokeStyle = grad;
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  };

  const drawNodes = () => {
    for (let i = 0; i < nodes.length; i++) {
      if (pop[i] < 0) continue;
      const n = nodes[i];
      const scale = pop[i] >= 1 ? 1 : Math.max(0, easeOutBack(pop[i]));
      const swell = 1 + hoverAmt[i] * 0.42 + act[i] * 0.3;
      const r = n.r * scale * swell;
      const breathe = reduced ? 0 : 0.5 + 0.5 * Math.sin(clock * 1.15 + i * 1.7);
      const glow = 0.1 + breathe * 0.07 + act[i] * 0.7 + hoverAmt[i] * 0.3;
      const gr = r + 5 + act[i] * 20 + hoverAmt[i] * 8;
      ctx.globalCompositeOperation = "lighter";
      const halo = ctx.createRadialGradient(n.x, n.y, r * 0.6, n.x, n.y, gr);
      halo.addColorStop(0, rgba(BRIGHT, glow));
      halo.addColorStop(1, rgba(BRIGHT, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(n.x, n.y, gr, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      if (act[i] > 0.02) {
        // expanding ring as the node fires
        const ringR = n.r + (1 - act[i]) * 30;
        ctx.strokeStyle = rgba(HOT, act[i] * 0.55);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, ringR, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (hoverAmt[i] > 0.02) {
        ctx.strokeStyle = rgba(BRIGHT, hoverAmt[i] * 0.45);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 5 + hoverAmt[i] * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      const lit = clamp(act[i] + hoverAmt[i] * 0.6, 0, 1);
      ctx.fillStyle = `rgb(${Math.round(BRIGHT[0] + (HOT[0] - BRIGHT[0]) * lit)},${Math.round(BRIGHT[1] + (HOT[1] - BRIGHT[1]) * lit)},${Math.round(BRIGHT[2] + (HOT[2] - BRIGHT[2]) * lit)})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const draw = () => {
    const dpr = canvas.width / (size.cssW || 1);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.cssW, size.cssH);
    const k = size.k;
    ctx.setTransform(dpr * k, 0, 0, dpr * k, dpr * tilt.x, dpr * tilt.y);
    drawRest();
    drawProximity();
    drawSignals();
    drawNodes();
  };

  // ---- sizing & loop ----------------------------------------------------
  const resize = () => {
    const rect = host.getBoundingClientRect();
    if (!rect.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = rect.width;
    const cssH = (rect.width * H) / W;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    size = { cssW, cssH, k: cssW / W };
    draw();
  };

  const tick = (now: number) => {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    draw();
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running || reduced) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // ---- pointer ----------------------------------------------------------
  const toArt = (ev: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return { x: ((ev.clientX - rect.left) / rect.width) * W, y: ((ev.clientY - rect.top) / rect.height) * H, rect };
  };
  const nearestNode = (x: number, y: number, hit: number) => {
    let best = -1;
    let bestD = hit;
    nodes.forEach((n, i) => {
      if (pop[i] < 0) return;
      const d = Math.hypot(n.x - x, n.y - y);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  };

  const onMove = (ev: PointerEvent) => {
    if (reduced) return;
    const { x, y } = toArt(ev);
    pointer.x = x - tilt.x / size.k;
    pointer.y = y - tilt.y / size.k;
    pointer.inside = true;
    tilt.tx = ((x / W) * 2 - 1) * TILT;
    tilt.ty = ((y / H) * 2 - 1) * TILT;
    hoverNode = ev.pointerType === "touch" ? -1 : nearestNode(x, y, NODE_HIT);
    canvas.style.cursor = hoverNode >= 0 ? "pointer" : "";
  };
  const onLeave = () => {
    pointer.inside = false;
    tilt.tx = 0;
    tilt.ty = 0;
    hoverNode = -1;
    canvas.style.cursor = "";
  };
  const onDown = (ev: PointerEvent) => {
    if (reduced || !introDone) return;
    const { x, y } = toArt(ev);
    const n = nearestNode(x, y, ev.pointerType === "touch" ? NODE_HIT * 1.6 : NODE_HIT);
    if (n >= 0) fireNode(n);
    else poke(x - tilt.x / size.k, y - tilt.y / size.k);
    if (!running) start();
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("pointerdown", onDown);

  // ---- lifecycle --------------------------------------------------------
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  let visible = true;
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible && document.visibilityState === "visible") start();
      else stop();
    },
    { threshold: 0.01 },
  );
  io.observe(host);
  const onVisibility = () => {
    if (document.visibilityState === "visible" && visible) start();
    else stop();
  };
  document.addEventListener("visibilitychange", onVisibility);

  if (!reduced) startIntro();
  resize();
  start();

  return {
    setReduced(next: boolean) {
      if (next === reduced) return;
      reduced = next;
      if (reduced) {
        stop();
        signals.length = 0;
        introDone = true;
        fullyReveal();
        pop.fill(1);
        act.fill(0);
        hoverAmt.fill(0);
        tilt = { x: 0, y: 0, tx: 0, ty: 0 };
        pointer.influence = 0;
        draw();
      } else {
        start();
      }
    },
    destroy() {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
    },
  };
}
