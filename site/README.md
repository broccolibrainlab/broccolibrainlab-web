# Broccoli Brain Lab — website

A Next.js app (App Router, TypeScript) with a dark theme only. It builds to a fully static site (`output: "export"`), so there's no server to run in production and it can be hosted anywhere, including GitHub Pages.

```
site/
├── app/
│   ├── layout.tsx         <html>, metadata, self-hosted Inter via next/font
│   ├── page.tsx           composes the page sections
│   ├── globals.css        design tokens (top of file), layout, responsive rules
│   ├── fonts/             InterVariable.woff2 (wght + opsz axes), OFL.txt licence
│   ├── icon.png           favicon
│   └── apple-icon.png
├── components/
│   ├── SiteHeader.tsx     header + accessible mobile menu (client)
│   ├── Hero.tsx           headline, actions, brain artwork
│   ├── HeroBrain.tsx      interactive canvas brain with a static <noscript> fallback (client)
│   ├── Exploring.tsx      three exploration areas
│   ├── ResearchStrip.tsx  research-in-progress strip + "View project" disclosure (client)
│   ├── SplitSection.tsx   shared label + heading / content layout used by About, Notes, Contact
│   ├── About.tsx, Notes.tsx, Contact.tsx, SiteFooter.tsx
│   ├── LogoMark.tsx       the logo mark image, used in header, About and footer
│   ├── InPageFocus.tsx    moves keyboard focus to in-page link targets (client)
│   └── icons.tsx          inline SVG icons and the <Arrow direction> component
├── lib/
│   ├── site.ts            site name, tagline, LinkedIn URL, section ids, nav items, mobile breakpoint
│   └── brainEngine.ts     framework-free canvas animation for the hero brain
├── assets/
│   ├── images/            hero-brain.png, logo-mark.png
│   └── data/              brain-graph.json (traced geometry of the hero brain)
├── public/.nojekyll       stops GitHub Pages' Jekyll from hiding the _next/ folder
└── next.config.ts         static export; optional base path; images served unmodified
```

## Requirements

Node.js 20.9 or newer.

## Commands

```bash
npm install
npm run dev        # local development at http://localhost:3000
npm run build      # static site written to out/
npm run lint
npm run typecheck
npm run check      # lint + typecheck + build; run before pushing
```

To preview the production build, serve `out/` with any static server:

```bash
python3 -m http.server 8000 -d out
```

## Deploy

Upload the contents of `out/` to any static host.

For a GitHub Pages project site (`https://<user>.github.io/<repo>/`), build with the repository name as the base path:

```bash
NEXT_PUBLIC_BASE_PATH=/<repo> npm run build
```

For a user site (`https://<user>.github.io/`) or a custom domain, build without it.

## Editing

- **Site name, tagline, LinkedIn link, navigation:** `lib/site.ts`. Every component reads them from there.
- **Section copy:** in each section's component in `components/`.
- **Colours, spacing, type scale:** the tokens are at the top of `app/globals.css` (`--bg`, `--sage`, `--text`, `--gutter`, …). The hero canvas reads `--sage` and `--sage-bright` at runtime. If you change `--bg`, also update `themeColor` in `app/layout.tsx`.
- **Mobile breakpoint:** `820px` is used in `app/globals.css` and in `MOBILE_NAV_QUERY` in `lib/site.ts`. Change both together.
- **Team members:** the `#team` block in `About.tsx` holds a placeholder. Replace it with real member details when you have them.
- **Notes:** the `TOPICS` list in `Notes.tsx` has plain descriptions. Swap them for links once notes are published.

## How the assets were made

- **Hero brain:** `hero-brain.png` is a lossless crop of `visuals/approved/01-original-dark-homepage.png` (x=810, y=96, 665 × 520), with the small tagline text covered by blank background. The interactive canvas draws the same artwork from `brain-graph.json`, a trace of that crop. Visitors without JavaScript see the PNG.
- **Logo:** the supplied square logo, cropped to the mark. Its alpha channel was derived from the original's flat dark background, then it was downscaled. The mark was not redrawn.
- **Font:** Inter is a best match. The exact font in the reference image was never identified.
