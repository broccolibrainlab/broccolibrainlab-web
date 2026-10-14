// Checks the saliency models against visual-search displays with a known odd item out.
// Run with `npm test` (Node's built-in test runner; no dependencies).

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { computeSaliency, predictFixations, type RGBAImage, type SaliencyMethod } from "../lib/saliency.ts";
import { STIMULUS_CELLS, colourPopout, orientationPopout, type Stimulus } from "../lib/saliencyStimuli.ts";

const ALL_CELLS = Array.from({ length: STIMULUS_CELLS }, (_, i) => i);

/** The first predicted fixation lands on the target, and the target clearly beats the strongest distractor. */
function assertPopsOut(stimulus: Stimulus, method: SaliencyMethod, label: string) {
  const { image, target } = stimulus;
  const [first, second] = predictFixations(computeSaliency(image, method), 2);
  const distance = Math.hypot(first.x * image.width - target.x, first.y * image.height - target.y);
  assert.ok(distance <= target.radius + 16, `${label}: first fixation is ${distance.toFixed(0)} px from the target`);
  assert.ok(first.value / second.value >= 1.25, `${label}: target only ${(first.value / second.value).toFixed(2)}× the best distractor`);
}

function solid(width: number, height: number, rgb: [number, number, number]): RGBAImage {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) data.set([...rgb, 255], i);
  return { width, height, data };
}

function mirror(image: RGBAImage): RGBAImage {
  const data = new Uint8ClampedArray(image.data.length);
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const from = (y * image.width + x) * 4;
      const to = (y * image.width + (image.width - 1 - x)) * 4;
      for (let c = 0; c < 4; c++) data[to + c] = image.data[from + c];
    }
  }
  return { width: image.width, height: image.height, data };
}

function halve(image: RGBAImage): RGBAImage {
  const width = image.width / 2;
  const height = image.height / 2;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 4; c++) {
        const at = (dx: number, dy: number) => image.data[((y * 2 + dy) * image.width + x * 2 + dx) * 4 + c];
        data[(y * width + x) * 4 + c] = (at(0, 0) + at(1, 0) + at(0, 1) + at(1, 1)) / 4;
      }
    }
  }
  return { width, height, data };
}

describe("finds a colour singleton (red among green) at every position", () => {
  for (const method of ["itti", "spectral", "frequency"] as const) {
    test(method, () => {
      for (const cell of ALL_CELLS) assertPopsOut(colourPopout(cell), method, `cell ${cell}`);
    });
  }
});

// Frequency-tuned compares colours only, so it can't see an orientation difference; the tool's page says so.
describe("finds an orientation singleton (tilted among vertical) at every position", () => {
  for (const method of ["itti", "spectral"] as const) {
    test(method, () => {
      for (const cell of ALL_CELLS) assertPopsOut(orientationPopout(cell), method, `cell ${cell}`);
    });
  }
});

describe("behaves consistently", () => {
  for (const method of ["itti", "spectral", "frequency"] as const) {
    test(`${method}: mirroring the image mirrors the result`, () => {
      const stimulus = colourPopout(8);
      const [plain] = predictFixations(computeSaliency(stimulus.image, method), 1);
      const [mirrored] = predictFixations(computeSaliency(mirror(stimulus.image), method), 1);
      assert.ok(Math.abs(plain.x - (1 - mirrored.x)) < 0.02 && Math.abs(plain.y - mirrored.y) < 0.02);
    });

    test(`${method}: finds the same target at half the resolution`, () => {
      const stimulus = colourPopout(23);
      const small = halve(stimulus.image);
      assertPopsOut({ image: small, target: { x: stimulus.target.x / 2, y: stimulus.target.y / 2, radius: stimulus.target.radius / 2 } }, method, "half size");
    });

    test(`${method}: a single-colour image has no salience and no fixations`, () => {
      const map = computeSaliency(solid(300, 200, [90, 140, 200]), method);
      assert.ok(map.data.every((v) => v === 0));
      assert.equal(predictFixations(map, 5).length, 0);
    });

    test(`${method}: odd sizes give a 0–1 map with the image's proportions`, () => {
      for (const [width, height] of [
        [3, 2],
        [1000, 10],
        [37, 801],
      ]) {
        const stimulus = colourPopout(4);
        // Crop the stimulus to the requested size (tiling if it's larger).
        const data = new Uint8ClampedArray(width * height * 4);
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const from = ((y % stimulus.image.height) * stimulus.image.width + (x % stimulus.image.width)) * 4;
            for (let c = 0; c < 4; c++) data[(y * width + x) * 4 + c] = stimulus.image.data[from + c];
          }
        }
        const map = computeSaliency({ width, height, data }, method);
        assert.ok(Math.abs(map.width / map.height - width / height) < 0.2 * (width / height) + 1 / map.height, `${width}×${height} → ${map.width}×${map.height}`);
        assert.ok(map.data.every((v) => Number.isFinite(v) && v >= 0 && v <= 1), `${width}×${height}: values outside 0–1`);
      }
    });
  }
});

// Photo-like texture (random detail at several scales, larger features stronger, as in natural images), lit like a
// landscape: brighter at the top, darker at the bottom. Nothing in it stands out, so fixations should spread over
// the image. The FFT behind spectral residual wraps the dark bottom edge onto the bright top one; without a taper
// at the borders that seam pulls most fixations onto the image edges. (The other two models rightly pick out the
// brightest top and darkest bottom of this image, so the check applies to spectral residual only.)
function landscapeTexture(seed: number): RGBAImage {
  const width = 480;
  const height = 360;
  let state = seed;
  const random = () => ((state = (state * 16807) % 2147483647) / 2147483647);
  const value = new Float32Array(width * height);
  for (const cell of [96, 48, 24, 12, 6]) {
    const cols = Math.ceil(width / cell) + 2;
    const rows = Math.ceil(height / cell) + 2;
    const grid = Array.from({ length: cols * rows }, random);
    for (let y = 0; y < height; y++) {
      const gy = y / cell;
      const y0 = Math.floor(gy);
      const ty = gy - y0;
      for (let x = 0; x < width; x++) {
        const gx = x / cell;
        const x0 = Math.floor(gx);
        const tx = gx - x0;
        const top = grid[y0 * cols + x0] * (1 - tx) + grid[y0 * cols + x0 + 1] * tx;
        const bottom = grid[(y0 + 1) * cols + x0] * (1 - tx) + grid[(y0 + 1) * cols + x0 + 1] * tx;
        value[y * width + x] += (top * (1 - ty) + bottom * ty - 0.5) * cell;
      }
    }
  }
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const v = 128 + value[y * width + x] * 0.6 + 70 - (y / (height - 1)) * 140;
      data.set([v, v, v, 255], (y * width + x) * 4);
    }
  }
  return { width, height, data };
}

test("spectral: a top-to-bottom brightness change doesn't pull fixations to the image edges", () => {
  let atEdge = 0;
  for (const seed of [1, 2, 3, 4, 5]) {
    const fixations = predictFixations(computeSaliency(landscapeTexture(seed), "spectral"), 5);
    atEdge += fixations.filter((f) => Math.min(f.x, 1 - f.x, f.y, 1 - f.y) < 0.03).length;
  }
  assert.ok(atEdge <= 5, `${atEdge} of 25 fixations within 3% of an edge`);
});

describe("predicted fixations", () => {
  test("are separated by at least the inhibition-of-return radius and ordered by salience", () => {
    const map = computeSaliency(orientationPopout(14).image, "itti");
    const radius = 0.1;
    const fixations = predictFixations(map, 8, radius);
    assert.ok(fixations.length >= 3);
    const long = Math.max(map.width, map.height);
    for (let i = 0; i < fixations.length; i++) {
      if (i > 0) assert.ok(fixations[i].value <= fixations[i - 1].value);
      for (let j = 0; j < i; j++) {
        const dx = (fixations[i].x - fixations[j].x) * map.width;
        const dy = (fixations[i].y - fixations[j].y) * map.height;
        assert.ok(Math.hypot(dx, dy) > radius * long, `fixations ${j + 1} and ${i + 1} overlap`);
      }
    }
  });
});
