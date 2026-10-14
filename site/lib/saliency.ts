/* Bottom-up visual saliency, computed entirely on the visitor's device.
   Framework-free and dependency-free: the browser tool and `npm test` (node --test) both import it.

   Methods
   - itti:      Itti, Koch & Niebur (1998). Intensity, colour-opponent and orientation channels, centre-surround
                differences across a Gaussian pyramid, combined with the map normalisation operator N(.).
                Colour contrast uses the double-opponent form of Walther & Koch's Saliency Toolbox (2006).
   - spectral:  Hou & Zhang (2007). The spectral residual of the log amplitude spectrum, on luminance.
   - frequency: Achanta, Hemami, Estrada & Süsstrunk (2009). Distance of each slightly blurred pixel from the
                image's mean colour in CIELAB. */

export type RGBAImage = { width: number; height: number; data: ArrayLike<number> };
export type GrayMap = { width: number; height: number; data: Float32Array };
export type SaliencyMethod = "itti" | "spectral" | "frequency";
/** A predicted fixation. x and y are fractions of the image width and height (0–1); value is the map value there. */
export type Fixation = { x: number; y: number; value: number };

/** Longest side of the map computeSaliency returns. Callers scale it up to the image. */
export const MAP_SIZE = 256;

const ITTI_SIZE = 640; // Itti et al. used 640 × 480 input, giving 40 × 30 maps at pyramid level 4
const FREQUENCY_SIZE = 400;
const SPECTRAL_SIZE = 64; // Hou & Zhang work on a 64 px image; must be a power of two for the FFT
const SPECTRAL_TAPER = 6; // px faded towards the mean at each edge of the 64 px image

/** Final smoothing, as a fraction of the map's longest side. */
const SMOOTHING: Record<SaliencyMethod, number> = { itti: 0.02, spectral: 0.01, frequency: 0 };

export function fitSize(width: number, height: number, longest: number): [number, number] {
  const scale = longest / Math.max(width, height);
  return [Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale))];
}

export function computeSaliency(image: RGBAImage, method: SaliencyMethod): GrayMap {
  const [width, height] = fitSize(image.width, image.height, MAP_SIZE);
  if (isFlat(image)) return createMap(width, height); // nothing stands out in a single-colour image

  const raw = method === "itti" ? itti(image) : method === "spectral" ? spectralResidual(image) : frequencyTuned(image);
  const map = resize(raw, width, height);
  return normalizeRange(blur(map, SMOOTHING[method] * Math.max(width, height)));
}

/** Winner-take-all with inhibition of return: repeatedly take the peak, then suppress a disc around it.
    radius is a fraction of the map's longest side. Stops early when what remains is near zero. */
export function predictFixations(map: GrayMap, count: number, radius = 0.1): Fixation[] {
  const { width: w, height: h } = map;
  const data = new Float32Array(map.data);
  const r = radius * Math.max(w, h);
  const fixations: Fixation[] = [];

  for (let n = 0; n < count; n++) {
    let best = 0;
    let bestIndex = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i] > best) {
        best = data[i];
        bestIndex = i;
      }
    }
    if (bestIndex < 0 || best < 0.05) break;

    const cx = bestIndex % w;
    const cy = (bestIndex - cx) / w;
    fixations.push({ x: (cx + 0.5) / w, y: (cy + 0.5) / h, value: map.data[bestIndex] });

    for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(h - 1, Math.ceil(cy + r)); y++) {
      for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(w - 1, Math.ceil(cx + r)); x++) {
        if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) data[y * w + x] = 0;
      }
    }
  }
  return fixations;
}

/** How salience is distributed over one image. Maps are scaled to their own image, so these describe where
    attention goes within an image and how concentrated it is, not how eye-catching one image is versus another. */
export type SaliencySummary = {
  /** How many times more salient the peak is than the best spot elsewhere (outside the inhibition-of-return radius).
      About 1 when several spots compete equally; higher when one spot clearly dominates. Capped at 20. */
  standout: number;
  /** Share of the image that is at least half as salient as its peak. */
  salientArea: number;
  /** The most salient point, as fractions of the image width and height. */
  peak: { x: number; y: number };
};

const STANDOUT_FLOOR = 0.05; // runner-up values below this count as 0.05, which caps standout at 20

/** Returns null for a map with no salience at all (a single-colour image). */
export function summarizeSaliency(map: GrayMap, radius = 0.1): SaliencySummary | null {
  const [first, second] = predictFixations(map, 2, radius);
  if (!first) return null;
  const half = first.value / 2;
  let salient = 0;
  for (const v of map.data) if (v >= half) salient++;
  return {
    standout: first.value / Math.max(second?.value ?? 0, STANDOUT_FLOOR),
    salientArea: salient / map.data.length,
    peak: { x: first.x, y: first.y },
  };
}

/* ---------- Map primitives ---------- */

function createMap(width: number, height: number): GrayMap {
  return { width, height, data: new Float32Array(width * height) };
}

function copyMap(map: GrayMap): GrayMap {
  return { width: map.width, height: map.height, data: new Float32Array(map.data) };
}

function gaussianKernel(sigma: number): Float32Array {
  if (sigma < 0.3) return new Float32Array([1]);
  const radius = Math.ceil(sigma * 3);
  const kernel = new Float32Array(radius * 2 + 1);
  let sum = 0;
  for (let i = -radius; i <= radius; i++) {
    kernel[i + radius] = Math.exp(-(i * i) / (2 * sigma * sigma));
    sum += kernel[i + radius];
  }
  for (let i = 0; i < kernel.length; i++) kernel[i] /= sum;
  return kernel;
}

const BINOMIAL = new Float32Array([1 / 16, 4 / 16, 6 / 16, 4 / 16, 1 / 16]);
const BOX3 = new Float32Array([1 / 3, 1 / 3, 1 / 3]);

/** Separable convolution; pixels beyond the edge repeat the edge. */
function convolve(map: GrayMap, kx: Float32Array, ky: Float32Array): GrayMap {
  const { width: w, height: h, data } = map;
  const rx = (kx.length - 1) >> 1;
  const ry = (ky.length - 1) >> 1;
  const tmp = new Float32Array(w * h);
  const out = createMap(w, h);

  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let k = -rx; k <= rx; k++) {
        const xx = x + k < 0 ? 0 : x + k >= w ? w - 1 : x + k;
        acc += data[row + xx] * kx[k + rx];
      }
      tmp[row + x] = acc;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let k = -ry; k <= ry; k++) {
        const yy = y + k < 0 ? 0 : y + k >= h ? h - 1 : y + k;
        acc += tmp[yy * w + x] * ky[k + ry];
      }
      out.data[y * w + x] = acc;
    }
  }
  return out;
}

function blur(map: GrayMap, sigma: number): GrayMap {
  const kernel = gaussianKernel(sigma);
  return kernel.length === 1 ? copyMap(map) : convolve(map, kernel, kernel);
}

/** Bilinear resize. Shrinking low-pass filters first so fine detail doesn't alias. */
function resize(map: GrayMap, width: number, height: number): GrayMap {
  if (width === map.width && height === map.height) return copyMap(map);
  const sx = map.width / width;
  const sy = map.height / height;
  const src = sx > 1 || sy > 1 ? convolve(map, gaussianKernel((sx - 1) / 2), gaussianKernel((sy - 1) / 2)) : map;
  const { width: w, height: h, data } = src;
  const out = createMap(width, height);

  for (let y = 0; y < height; y++) {
    const fy = Math.min(Math.max((y + 0.5) * sy - 0.5, 0), h - 1);
    const y0 = Math.floor(fy);
    const y1 = Math.min(y0 + 1, h - 1);
    const ty = fy - y0;
    for (let x = 0; x < width; x++) {
      const fx = Math.min(Math.max((x + 0.5) * sx - 0.5, 0), w - 1);
      const x0 = Math.floor(fx);
      const x1 = Math.min(x0 + 1, w - 1);
      const tx = fx - x0;
      const top = data[y0 * w + x0] * (1 - tx) + data[y0 * w + x1] * tx;
      const bottom = data[y1 * w + x0] * (1 - tx) + data[y1 * w + x1] * tx;
      out.data[y * width + x] = top * (1 - ty) + bottom * ty;
    }
  }
  return out;
}

/** Rescales to 0–1 in place. A flat map carries no information and becomes all zeros. */
function normalizeRange(map: GrayMap): GrayMap {
  let min = Infinity;
  let max = -Infinity;
  for (const v of map.data) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = max - min;
  if (!(range > 1e-9)) map.data.fill(0);
  else for (let i = 0; i < map.data.length; i++) map.data[i] = (map.data[i] - min) / range;
  return map;
}

function isFlat(image: RGBAImage): boolean {
  const { data } = image;
  const min = [255, 255, 255];
  const max = [0, 0, 0];
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const v = data[i + c];
      if (v < min[c]) min[c] = v;
      if (v > max[c]) max[c] = v;
    }
  }
  return max[0] - min[0] <= 1 && max[1] - min[1] <= 1 && max[2] - min[2] <= 1;
}

/** Splits RGBA (0–255) into r, g, b maps (0–1) at the requested size. Alpha is ignored. */
function channels(image: RGBAImage, width: number, height: number) {
  const r = createMap(image.width, image.height);
  const g = createMap(image.width, image.height);
  const b = createMap(image.width, image.height);
  for (let i = 0, p = 0; i < r.data.length; i++, p += 4) {
    r.data[i] = image.data[p] / 255;
    g.data[i] = image.data[p + 1] / 255;
    b.data[i] = image.data[p + 2] / 255;
  }
  return { r: resize(r, width, height), g: resize(g, width, height), b: resize(b, width, height) };
}

/* ---------- Itti, Koch & Niebur ---------- */

// (centre level, surround level) pairs: c ∈ {2, 3, 4}, s = c + δ, δ ∈ {3, 4}.
const CENTRE_SURROUND: readonly (readonly [number, number])[] = [
  [2, 5],
  [2, 6],
  [3, 6],
  [3, 7],
  [4, 7],
  [4, 8],
];
const PYRAMID_LEVELS = 9;
const CONSPICUITY_LEVEL = 4;
const ORIENTATIONS = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];

function pyrDown(map: GrayMap): GrayMap {
  const blurred = convolve(map, BINOMIAL, BINOMIAL);
  const w = Math.max(1, map.width >> 1);
  const h = Math.max(1, map.height >> 1);
  const out = createMap(w, h);
  for (let y = 0; y < h; y++) {
    const sy = Math.min(y * 2, map.height - 1);
    for (let x = 0; x < w; x++) out.data[y * w + x] = blurred.data[sy * map.width + Math.min(x * 2, map.width - 1)];
  }
  return out;
}

function gaussianPyramid(map: GrayMap): GrayMap[] {
  const levels = [map];
  while (levels.length < PYRAMID_LEVELS) levels.push(pyrDown(levels[levels.length - 1]));
  return levels;
}

/** The N(.) operator: scale to 0–1, then multiply by (1 − m)², where m is the mean of the other local maxima.
    A map with one strong peak keeps it; a map with many similar peaks is suppressed. */
function normalizeItti(map: GrayMap): GrayMap {
  const out = normalizeRange(copyMap(map));
  const { width: w, height: h, data } = out;
  let globalIndex = 0;
  for (let i = 1; i < data.length; i++) if (data[i] > data[globalIndex]) globalIndex = i;
  if (data[globalIndex] === 0) return out;

  let sum = 0;
  let count = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const v = data[i];
      if (v < 0.1 || i === globalIndex) continue;
      // Strict on two sides, non-strict on the other two, so a flat-topped peak counts once.
      if (x > 0 && v <= data[i - 1]) continue;
      if (y > 0 && v <= data[i - w]) continue;
      if (x < w - 1 && v < data[i + 1]) continue;
      if (y < h - 1 && v < data[i + w]) continue;
      sum += v;
      count++;
    }
  }
  const weight = (1 - (count ? sum / count : 0)) ** 2;
  for (let i = 0; i < data.length; i++) data[i] *= weight;
  return out;
}

function addResized(acc: GrayMap, map: GrayMap) {
  const m = resize(map, acc.width, acc.height);
  for (let i = 0; i < acc.data.length; i++) acc.data[i] += m.data[i];
}

/** Sum over scales of N(|centre − surround|), at the conspicuity level, for each pyramid given. */
function conspicuity(pyramids: GrayMap[][], width: number, height: number): GrayMap {
  const acc = createMap(width, height);
  for (const pyramid of pyramids) {
    for (const [c, s] of CENTRE_SURROUND) {
      const centre = pyramid[c];
      const surround = resize(pyramid[s], centre.width, centre.height);
      const diff = createMap(centre.width, centre.height);
      for (let i = 0; i < diff.data.length; i++) diff.data[i] = Math.abs(centre.data[i] - surround.data[i]);
      addResized(acc, normalizeItti(diff));
    }
  }
  return acc;
}

const GABOR_RADIUS = 5;
const GABOR_SIGMA = 2;
const GABOR_WAVELENGTH = 5;
const GABOR_ASPECT = 0.5;

/** Even (cosine) and odd (sine) Gabor kernels; the even one is made zero-mean so flat areas give no response. */
function gaborKernels(theta: number) {
  const size = GABOR_RADIUS * 2 + 1;
  const even = new Float32Array(size * size);
  const odd = new Float32Array(size * size);
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  let mean = 0;
  for (let y = -GABOR_RADIUS; y <= GABOR_RADIUS; y++) {
    for (let x = -GABOR_RADIUS; x <= GABOR_RADIUS; x++) {
      const u = x * cos + y * sin;
      const v = -x * sin + y * cos;
      const envelope = Math.exp(-(u * u + GABOR_ASPECT * GABOR_ASPECT * v * v) / (2 * GABOR_SIGMA * GABOR_SIGMA));
      const i = (y + GABOR_RADIUS) * size + x + GABOR_RADIUS;
      even[i] = envelope * Math.cos((2 * Math.PI * u) / GABOR_WAVELENGTH);
      odd[i] = envelope * Math.sin((2 * Math.PI * u) / GABOR_WAVELENGTH);
      mean += even[i];
    }
  }
  mean /= even.length;
  for (let i = 0; i < even.length; i++) even[i] -= mean;
  return { even, odd };
}

/** Phase-invariant Gabor energy, sqrt(even² + odd²). */
function gaborEnergy(map: GrayMap, even: Float32Array, odd: Float32Array): GrayMap {
  const { width: w, height: h, data } = map;
  const size = GABOR_RADIUS * 2 + 1;
  const out = createMap(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let e = 0;
      let o = 0;
      for (let ky = -GABOR_RADIUS; ky <= GABOR_RADIUS; ky++) {
        const yy = y + ky < 0 ? 0 : y + ky >= h ? h - 1 : y + ky;
        const row = yy * w;
        const krow = (ky + GABOR_RADIUS) * size + GABOR_RADIUS;
        for (let kx = -GABOR_RADIUS; kx <= GABOR_RADIUS; kx++) {
          const xx = x + kx < 0 ? 0 : x + kx >= w ? w - 1 : x + kx;
          const v = data[row + xx];
          e += v * even[krow + kx];
          o += v * odd[krow + kx];
        }
      }
      out.data[y * w + x] = Math.sqrt(e * e + o * o);
    }
  }
  return out;
}

function itti(image: RGBAImage): GrayMap {
  const [w, h] = fitSize(image.width, image.height, ITTI_SIZE);
  const { r, g, b } = channels(image, w, h);
  const intensity = createMap(w, h);
  const redGreen = createMap(w, h);
  const blueYellow = createMap(w, h);

  let maxIntensity = 0;
  for (let i = 0; i < intensity.data.length; i++) {
    intensity.data[i] = (r.data[i] + g.data[i] + b.data[i]) / 3;
    if (intensity.data[i] > maxIntensity) maxIntensity = intensity.data[i];
  }
  // Hue is normalised by intensity, and ignored where it's too dark to be reliable (below a tenth of the maximum).
  for (let i = 0; i < intensity.data.length; i++) {
    const iv = intensity.data[i];
    if (iv <= maxIntensity / 10) continue;
    const rn = r.data[i] / iv;
    const gn = g.data[i] / iv;
    const bn = b.data[i] / iv;
    const R = Math.max(0, rn - (gn + bn) / 2);
    const G = Math.max(0, gn - (rn + bn) / 2);
    const B = Math.max(0, bn - (rn + gn) / 2);
    const Y = Math.max(0, (rn + gn) / 2 - Math.abs(rn - gn) / 2 - bn);
    redGreen.data[i] = R - G;
    blueYellow.data[i] = B - Y;
  }

  const intensityPyramid = gaussianPyramid(intensity);
  const { width: cw, height: ch } = intensityPyramid[CONSPICUITY_LEVEL];

  const orientation = createMap(cw, ch);
  for (const theta of ORIENTATIONS) {
    const { even, odd } = gaborKernels(theta);
    // Levels 0 and 1 are never used as centres or surrounds, so skip filtering them.
    const pyramid = intensityPyramid.map((level, i) => (i < 2 ? level : gaborEnergy(level, even, odd)));
    addResized(orientation, normalizeItti(conspicuity([pyramid], cw, ch)));
  }

  const conspicuityMaps = [
    conspicuity([intensityPyramid], cw, ch),
    conspicuity([gaussianPyramid(redGreen), gaussianPyramid(blueYellow)], cw, ch),
    orientation,
  ].map(normalizeItti);

  const saliency = createMap(cw, ch);
  for (let i = 0; i < saliency.data.length; i++) {
    saliency.data[i] = (conspicuityMaps[0].data[i] + conspicuityMaps[1].data[i] + conspicuityMaps[2].data[i]) / 3;
  }
  return saliency;
}

/* ---------- Spectral residual (Hou & Zhang) ---------- */

/** In-place radix-2 FFT. The inverse is scaled by 1/n. */
function fft(re: Float64Array, im: Float64Array, inverse: boolean) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const angle = ((inverse ? 2 : -2) * Math.PI) / len;
    const wr = Math.cos(angle);
    const wi = Math.sin(angle);
    const half = len >> 1;
    for (let start = 0; start < n; start += len) {
      let cr = 1;
      let ci = 0;
      for (let k = 0; k < half; k++) {
        const a = start + k;
        const b = a + half;
        const br = re[b] * cr - im[b] * ci;
        const bi = re[b] * ci + im[b] * cr;
        re[b] = re[a] - br;
        im[b] = im[a] - bi;
        re[a] += br;
        im[a] += bi;
        const next = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = next;
      }
    }
  }
  if (inverse) {
    for (let i = 0; i < n; i++) {
      re[i] /= n;
      im[i] /= n;
    }
  }
}

function fft2D(re: Float64Array, im: Float64Array, n: number, inverse: boolean) {
  const rowRe = new Float64Array(n);
  const rowIm = new Float64Array(n);
  for (let pass = 0; pass < 2; pass++) {
    // pass 0 transforms rows, pass 1 columns
    const step = pass === 0 ? 1 : n;
    for (let line = 0; line < n; line++) {
      const start = pass === 0 ? line * n : line;
      for (let k = 0; k < n; k++) {
        rowRe[k] = re[start + k * step];
        rowIm[k] = im[start + k * step];
      }
      fft(rowRe, rowIm, inverse);
      for (let k = 0; k < n; k++) {
        re[start + k * step] = rowRe[k];
        im[start + k * step] = rowIm[k];
      }
    }
  }
}

function spectralResidual(image: RGBAImage): GrayMap {
  const n = SPECTRAL_SIZE;
  const { r, g, b } = channels(image, n, n);

  // The FFT treats the image as tiling the plane, so a mismatch between opposite edges (sky at the top, ground at
  // the bottom) would show up as false salience along the borders. Fading the outermost pixels to the mean
  // brightness (a cosine taper) removes that seam while leaving the rest of the image untouched.
  const gray = new Float64Array(n * n);
  let mean = 0;
  for (let i = 0; i < gray.length; i++) {
    gray[i] = 0.299 * r.data[i] + 0.587 * g.data[i] + 0.114 * b.data[i];
    mean += gray[i];
  }
  mean /= gray.length;
  const taper = (i: number) => {
    const d = Math.min(i + 0.5, n - i - 0.5);
    return d >= SPECTRAL_TAPER ? 1 : 0.5 - 0.5 * Math.cos((Math.PI * d) / SPECTRAL_TAPER);
  };
  const re = new Float64Array(n * n);
  const im = new Float64Array(n * n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) re[y * n + x] = mean + (gray[y * n + x] - mean) * taper(x) * taper(y);
  }

  fft2D(re, im, n, false);
  const logAmplitude = createMap(n, n);
  const phase = new Float64Array(n * n);
  for (let i = 0; i < re.length; i++) {
    logAmplitude.data[i] = Math.log(Math.hypot(re[i], im[i]) + 1e-6);
    phase[i] = Math.atan2(im[i], re[i]);
  }

  // The residual is what's left of the log spectrum after removing its local average (a 3 × 3 mean).
  const average = convolve(logAmplitude, BOX3, BOX3);
  for (let i = 0; i < re.length; i++) {
    const amplitude = Math.exp(logAmplitude.data[i] - average.data[i]);
    re[i] = amplitude * Math.cos(phase[i]);
    im[i] = amplitude * Math.sin(phase[i]);
  }
  fft2D(re, im, n, true);

  const saliency = createMap(n, n);
  for (let i = 0; i < re.length; i++) saliency.data[i] = re[i] * re[i] + im[i] * im[i];
  // The 64 × 64 square is stretched back to the image's proportions by computeSaliency.
  const [w, h] = fitSize(image.width, image.height, n);
  return resize(blur(saliency, 2.5), w, h);
}

/* ---------- Frequency-tuned (Achanta et al.) ---------- */

function srgbToLinear(c: number) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function labF(t: number) {
  return t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116;
}

function frequencyTuned(image: RGBAImage): GrayMap {
  const [w, h] = fitSize(image.width, image.height, FREQUENCY_SIZE);
  const { r, g, b } = channels(image, w, h);
  const L = createMap(w, h);
  const A = createMap(w, h);
  const B = createMap(w, h);
  const mean = [0, 0, 0];

  for (let i = 0; i < L.data.length; i++) {
    const lr = srgbToLinear(r.data[i]);
    const lg = srgbToLinear(g.data[i]);
    const lb = srgbToLinear(b.data[i]);
    // sRGB → XYZ (D65), relative to the white point
    const fx = labF((0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb) / 0.95047);
    const fy = labF(0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb);
    const fz = labF((0.0193339 * lr + 0.119192 * lg + 0.9503041 * lb) / 1.08883);
    L.data[i] = 116 * fy - 16;
    A.data[i] = 500 * (fx - fy);
    B.data[i] = 200 * (fy - fz);
    mean[0] += L.data[i];
    mean[1] += A.data[i];
    mean[2] += B.data[i];
  }
  for (let c = 0; c < 3; c++) mean[c] /= L.data.length;

  // A 5 × 5 binomial blur removes noise and fine texture before comparing with the mean.
  const [bl, ba, bb] = [L, A, B].map((m) => convolve(m, BINOMIAL, BINOMIAL));
  const saliency = createMap(w, h);
  for (let i = 0; i < saliency.data.length; i++) {
    saliency.data[i] = Math.hypot(bl.data[i] - mean[0], ba.data[i] - mean[1], bb.data[i] - mean[2]);
  }
  return saliency;
}
