# Broccoli Brain Lab

Website for Broccoli Brain Lab, a student-led group exploring cognition, memory and EEG.
*Observe, Question, Explore.*

## Repository layout

| Path | What it is |
|---|---|
| [`site/`](site/) | The website: a Next.js app exported as a static site. Start with [`site/README.md`](site/README.md). |
| [`BUILD_BRIEF.md`](BUILD_BRIEF.md), [`START_HERE.md`](START_HERE.md) | The original design and build brief. |
| [`visuals/approved/`](visuals/approved/) | Approved reference images: homepage comps, logo, banner. The hero brain and logo assets are extracted from these. |
| [`visuals/archive/`](visuals/archive/) | Superseded explorations, kept for context only. |
| [`ASSET_MANIFEST.json`](ASSET_MANIFEST.json) | Dimensions and checksums of the untouched source images. |
| [`verification/`](verification/) | Comparison screenshots from the first build, which matched the 1536 × 1024 comp pixel for pixel. The type scale and spacing were changed on request afterwards, so these no longer reflect the current page. |

## Quick start

```bash
cd site
npm install
npm run dev
```

See [`site/README.md`](site/README.md) for building, deploying (including GitHub Pages) and editing.
