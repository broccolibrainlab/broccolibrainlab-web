# Broccoli Brain Lab — website

A Next.js app (App Router, TypeScript) with a dark theme only. It builds to a fully static site (`output: "export"`), so there's no server to run in production and it can be hosted anywhere, including GitHub Pages.

```
site/
├── app/
│   ├── layout.tsx         <html>, metadata, self-hosted Inter via next/font
│   ├── page.tsx           home: business solutions (/)
│   ├── neuroscience/      the Neuroscience Lab (/neuroscience/), its Resources and the Saliency tool
│   ├── gaming/            the Gaming page (/gaming/), with the slot for the featured game
│   ├── resources/         old URLs; forward to /neuroscience/resources/…
│   ├── globals.css        design tokens + the three palettes (top of file), layout, responsive rules
│   └── fonts/, icon.png, apple-icon.png
├── components/
│   ├── PageShell.tsx      every page's frame: palette, header, area bar, main, footer
│   ├── SiteHeader.tsx     header, "Interested areas" menu and accessible mobile menu (client)
│   ├── AreaNav.tsx        the secondary bar on interested-area pages
│   ├── SmartLink.tsx      section links that stay in-page on their own page (client)
│   ├── HeroGraph.tsx      animated line artwork for each hero, with a no-JS fallback (client)
│   ├── SplitSection.tsx   shared label + heading / content layout
│   ├── business/          home sections: Hero, Services, Interests, Industries, Approach, Contact
│   ├── neuroscience/      lab sections: Hero, Exploring, ResearchStrip, About, Notes, Contact
│   ├── gaming/            gaming sections: Hero, Play, Exploring, Contact
│   ├── ResourceList.tsx, saliency/, MovedPage.tsx, InPageFocus.tsx, LogoMark.tsx, icons.tsx
├── lib/
│   ├── site.ts            name, LinkedIn URL, routes, palettes' theme colours, section ids, nav, interested areas
│   ├── resources.ts       the tools listed on the Resources page
│   ├── brainEngine.ts     framework-free canvas animation used by every hero
│   └── saliency*.ts       the saliency models, stimuli and drawing
├── scripts/
│   └── make-hero-graphs.mjs  generates business-graph.json and gaming-graph.json
├── assets/
│   ├── images/            hero-brain.png, logo-mark.png
│   └── data/              brain-graph.json (traced), business-graph.json, gaming-graph.json (generated)
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
npm test           # saliency model tests (Node's built-in test runner)
npm run check      # lint + typecheck + test + build; run before pushing
```

To preview the production build, serve `out/` with any static server:

```bash
python3 -m http.server 8000 -d out
```

## Deploy

**Vercel (live site):** every push to `main` is deployed to the Vercel project `broccolibrainlab-web` by the GitHub Actions workflow in `.github/workflows/deploy-vercel.yml`. It needs a repository secret named `VERCEL_TOKEN`; see the comment at the top of that file. The Vercel project's Root Directory is set to `site`. For a manual deploy, run `npx vercel deploy --prod` from the repository root, not from inside `site/`.

**Any other static host:** upload the contents of `out/`.

For a GitHub Pages project site (`https://<user>.github.io/<repo>/`), build with the repository name as the base path:

```bash
NEXT_PUBLIC_BASE_PATH=/<repo> npm run build
```

For a user site (`https://<user>.github.io/`) or a custom domain, build without it.

## Editing

- **Site name, tagline, LinkedIn link, navigation, interested areas:** `lib/site.ts`. Every component reads them from there. To add an interested area, add it to `AREAS` and `AREA_NAV`, give it a palette in `globals.css` and a `Theme`, and create its page with `<PageShell theme="…" area="…">`.
- **Palettes:** each area has its own block at the top of `app/globals.css` (business: brass, neuroscience: sage, gaming: violet). Components only use the shared tokens (`--accent`, `--bg`, `--rule`, …), so layout stays identical across pages. If you change a `--bg`, also update `THEME_COLOR` in `lib/site.ts`.
- **Hero artworks:** the brain is traced from the approved comp; the home page's industry map (a hub wired to six industry icons, with HTML labels and the logo in the hub) and the gaming controller come from `scripts/make-hero-graphs.mjs` (`node scripts/make-hero-graphs.mjs` regenerates them).
- **Featured game:** put the game (or an `<iframe>` of its build) inside `.game-stage` in `components/gaming/Play.tsx` and update its `FACTS`.
- **Section copy:** in each section's component in `components/`.
- **Logo colour:** `LogoMark` draws the supplied PNG as a mask over `--accent`, so the mark takes each page's palette automatically.
- **Industries:** the list in `components/business/Industries.tsx` and the icons in the hero artwork show the same six; change both together.
- **Colours, spacing, type scale:** the tokens are at the top of `app/globals.css` (`--bg`, `--accent`, `--text`, `--gutter`, …). The hero canvas reads `--accent`, `--accent-bright` and `--accent-hot` at runtime.
- **Mobile breakpoint:** `820px` is used in `app/globals.css` and in `MOBILE_NAV_QUERY` in `lib/site.ts`. Change both together.
- **Team:** the Team section on the home page reads `lib/team.ts`. Fill in each entry's `name`, `role`, optional `linkedin`, and `photo` (a file you put in `public/team/`, portrait 4:5). Entries without a name show as placeholder cards.
- **Contact email:** `SITE.email` in `lib/site.ts`. Every contact section links to it with `mailto:`, so it opens the visitor's own mail app, addressed to us, with a subject saying which page they came from.
- **Resources (tools):** add an entry to `RESOURCES` in `lib/resources.ts` with a `title`, a short `description`, an `href` and optional `tags`. The `href` can be a full external URL (a GitHub repo, a hosted app; opens in a new tab) or a page on this site. To host a tool on the site itself, create `app/neuroscience/resources/<tool-name>/page.tsx` and use `href: "/neuroscience/resources/<tool-name>/"`. While the list is empty, the page shows a "coming soon" message.
- **Saliency tool:** the models live in `lib/saliency.ts` and run entirely in the browser; images are never uploaded. Every model change should keep `npm test` passing: it checks that each model picks out the odd item in the sample displays at all 30 positions.
- **Notes:** the `TOPICS` list in `Notes.tsx` has plain descriptions. Swap them for links once notes are published.

## How the assets were made

- **Hero brain:** `hero-brain.png` is a lossless crop of `visuals/approved/01-original-dark-homepage.png` (x=810, y=96, 665 × 520), with the small tagline text covered by blank background. The interactive canvas draws the same artwork from `brain-graph.json`, a trace of that crop. Visitors without JavaScript see the PNG.
- **Logo:** the supplied square logo, cropped to the mark. Its alpha channel was derived from the original's flat dark background, then it was downscaled. The mark was not redrawn.
- **Font:** Inter is a best match. The exact font in the reference image was never identified.
