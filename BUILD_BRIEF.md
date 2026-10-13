# Broccoli Brain Lab — Website Design & Build Brief

This package contains visual references and implementation instructions only. It deliberately contains no existing website implementation, HTML, CSS, JavaScript, deployment configuration, or previously built SVG recreation. Build a fresh website from these resources.

## 1. Goal and organization

Create a minimal, professional, simple but stylish website for **Broccoli Brain Lab**, an undergraduate student group interested in the human brain, cognitive neuroscience and EEG. The group is learning together, reading cognitive neuroscience and mindfulness material, participating in EEG signal-processing competitions, and designing research with a professor concerning cognitive load and memory encoding using EEG.

The group has an exploratory identity and does not yet have a fixed long-term commercial mission. Do not turn it into an AI consulting company, clinical provider, established institute, or product startup. Do not invent members, university affiliations, results, publications, partners, awards, dates, statistics, equipment access, or funding.

Name for this website: **Broccoli Brain Lab**. Official tagline: **Observe, Question, Explore**. Broccoli was chosen because its shape resembles a brain.

## 2. Required technology

- Plain HTML, CSS and JavaScript only.
- No React, Next.js, Vue, component frameworks, build-system requirement, or backend for this scope.
- Use actual semantic HTML for the interface and content. Do not implement the whole webpage as a screenshot with invisible link hotspots.
- Local assets and fonts are preferred. Keep the site portable to static hosting, including GitHub Pages.
- Dark theme only. No light mode or theme switcher.

## 3. Authority of the visual references

There are two complementary approved website references. They are not interchangeable.

1. **`visuals/approved/01-original-dark-homepage.png`**: the user's uploaded base resource. This is authoritative for the original hero wording, original branching brain pattern, dark visual atmosphere, typography treatment, button styling, and open three-column exploration section.
2. **`visuals/approved/02-combined-homepage.png`**: the latest combined design. It preserves the original hero concept and adds the refined brand logo and a **separate research-in-progress strip** below the three columns. This is authoritative for the desired combination and research separation.
3. **`visuals/approved/03-refined-logo-lockup.png`**: the refined sage logo and brand-name lockup. Authoritative for the logo symbol's identity.
4. **`visuals/approved/04-square-logo.png`**: square, symbol-only logo for profile use. Use this supplied image if a small logo asset is needed; do not regenerate the mark.
5. **`visuals/approved/05-linkedin-banner.png`**: final banner with no official logo, the official tagline and a delicate neuron. This demonstrates the brand palette and supporting illustration style. Its neuron is **not** the website's hero brain.

The archive folder holds historical references for context only. Do not borrow the light themes, replace the original hero with the three-word headline, use the old banner tagline, or reintroduce “Solutions” from the legacy logo.

### Resolving the header difference

The original dark screenshot has a very simple outline symbol in the header. The combined screenshot uses the refined approved logo. The approved combined direction uses the **refined logo**, while preserving the **original hero illustration**. These are different visual elements. If a reviewer requests an exact reproduction of the original uploaded screenshot including its header, confirm that specific logo exception rather than silently conflating the two references.

## 4. Visual fidelity — especially the brain

The user explicitly requested an exactly identical visual result and singled out the design and brain patterns. Treat the supplied pixels as the source of truth, not as loose inspiration.

- Do not invent, redraw by eye, regenerate with an image model, simplify, or alter the brain's branches, curves, node positions, silhouette, colors or proportions.
- The original hero brain is only present inside the screenshot. Extract that exact region losslessly, or display it with precise CSS clipping of the original image. This is appropriate for a decorative illustration; the rest of the page should remain genuine HTML and CSS.
- Keep the untouched source images in the project. Preserve originals, and make any extracted resources as additional files.
- At the original reference scale, a useful initial crop for the hero art is approximately **x=810, y=96, width=660, height=520**, in `01-original-dark-homepage.png`. This includes the illustration and small tagline. Inspect and refine the crop; these are starting bounds, not a verified asset mask.
- If the small tagline is part of the crop, do not render it a second time. If text is excluded from the crop, render “OBSERVE · QUESTION · EXPLORE” separately at the lower-right of the hero art.
- Preserve the image's aspect ratio. Never stretch horizontally or vertically. Keep generous negative space around it.
- Do not substitute the banner's single neuron, the logo's brain/circuit symbol, a stock brain icon, or a new SVG approximation for the hero brain.
- Use the supplied logo image, or create an exact professionally traced vector with comparison checks. Do not call a visually similar regeneration an identical logo.

Pixel equivalence must be tested at a fixed viewport, browser, device-pixel ratio, font set and image scale. Do not claim zero-pixel error without producing a rendered comparison. Font rasterization can differ across operating systems. Fidelity at the reference size and responsive fidelity are separate checks.

## 5. Palette and atmosphere

| Role | Target color |
|---|---|
| Main background | Charcoal `#151917` |
| Brand accent / brain lines | Muted sage `#A4C7AE` |
| Primary text | Soft off-white `#F2F2EC` |
| Secondary text | Muted gray-green, approximately `#A8B0AA` |
| Dividers | Subtle gray-green, approximately `#354038` |

These are the chosen palette targets. The source image contains slight tonal/texture variation, so sample the reference when tuning the match. A flat fill is not automatically pixel-identical to that source.

Use restrained thin divider lines, airy composition, clean sans-serif typography, and quiet contrast. Avoid bright green, blue/purple accents, neon glow, flashy gradients, glossy 3D, glass cards, excessive rounded pills, dense network backgrounds, animated noise, and stock SaaS styling.

## 6. Typography

The original font file is not supplied and the exact typeface has not been verified. Identify or choose the closest font through visual comparison. A clean geometric/grotesk sans-serif is the intended direction. Inter is a possible starting candidate, not an established fact about the image.

Headline: large, bold, tightly spaced, two lines. Brand name: medium-weight sans-serif. Body: lighter-weight gray-green sans-serif with comfortable line spacing. Eyebrows and small captions: tiny uppercase text with wide tracking.

Self-host the chosen font when permitted, so rendering does not depend on whether a visitor happens to have it installed. Check text widths, line breaks, cap height, weight and baseline alignment, rather than matching nominal font sizes alone.

## 7. Desktop layout measurements

Original screenshot dimensions: **1536 × 1024 pixels**. First compare at a 1536 CSS-pixel viewport width and device-pixel ratio 1.

Approximate original positions to guide reconstruction:

- Main left/right margins: about 85 px.
- Header logo: near x=83, y=29; brand name begins around x=143.
- Navigation: right-aligned, with About, Research, Notes, Contact in that order.
- Hero eyebrow: near x=85, y=148.
- Headline visible text begins near x=83, y=204.
- Description begins near x=85, y=402.
- Primary action begins near x=85, y=506, about 237 × 60 px.
- Secondary action begins near x=365, y=531.
- Brain dominates the right side; preserve its position relative to the headline.
- Hero's bottom divider is around y=635.
- “What we’re exploring” begins around x=85, y=690.
- Three columns begin around x=85, x=574 and x=1065.
- Number labels and fine horizontal rules are near y=770.
- Column icons/titles begin around y=815.

Measure against the images during implementation. Use these as approximate anchors, not as proof of exact layout. The combined screenshot's lower section is more compact to leave space for the separate research strip. Follow `02-combined-homepage.png` for that lower vertical allocation.

## 8. Exact first-screen content

### Header

Brand: **Broccoli Brain Lab**

Navigation: **About**, **Research**, **Notes**, **Contact**.

### Hero

Eyebrow: **STUDENT-LED NEUROSCIENCE**

Headline, exactly two lines:

> Curious about
> the human brain.

First line is off-white. Second line is sage. Do not replace this headline with “Observe. Question. Explore.” The user explicitly requested the original wording back.

Description:

> Exploring cognition, memory and EEG through research and shared learning.

Primary action: **Explore our work →**

Secondary action: **Meet the team**

Small caption beside/beneath the art: **OBSERVE · QUESTION · EXPLORE**.

### Exploration section

Heading: **What we’re exploring**.

Use an open three-column layout with simple sage line icons, small numbered labels 01/02/03 and restrained dividers. No prominent card backgrounds.

Original descriptions, if matching the original screenshot:

1. **Cognition & memory** — “How we perceive, remember and make decisions. We explore questions about attention, memory encoding and the mental processes that shape behavior.”
2. **EEG & signal processing** — “Working with EEG to understand brain activity. We learn how to collect, process and analyze neural signals as a tool for studying cognition.”
3. **Learning together** — “A student-led group working closely with a professor, learning through hands-on research, discussion and EEG competitions.”

The combined design uses shorter descriptions to fit the separate research strip:

1. “Exploring attention, cognitive load and memory encoding.”
2. “Learning to process and interpret brain signals.”
3. “Reading, discussing and taking part in EEG competitions.”

Use the combined reference's shorter descriptions when implementing that approved full first-screen layout. Do not mix the longer copy with compact row heights and cause overflow.

### Separate research strip

- Small label: **RESEARCH IN PROGRESS**.
- Title: **Cognitive load & memory encoding**.
- Action: **View project →**.
- A short vertical sage accent on the left; quiet full-width divider above.
- Keep this distinct from the three exploration columns.
- Status is research being designed with a professor, not completed findings.

## 9. Below-the-fold content and interactions

Only the first screen has an approved visual mockup. The following is a suggested functional continuation, not another approved screenshot. Keep it restrained, coherent and factual.

### About / team

Introduce the group as undergraduate students learning about cognition, memory and EEG. Explain the broccoli–brain resemblance briefly. No individual names, portraits, roles, membership counts or university affiliations have been supplied. “Meet the team” can scroll to a group introduction until genuine member data is provided. Do not invent profile cards.

### Research details

“View project” should open or expand real details, with a keyboard-operable button and accurate expanded state. Suggested text:

> We’re designing a study with a professor to explore cognitive load and memory encoding using EEG signals. The study is being developed; findings will be shared when the research is ready.

### Notes

Reading and discussion topics can include EEG interpretation, memory encoding, attention and mindfulness. Do not present unsupplied articles as published work. Use plain topic descriptions, or clearly indicate that published notes will be added later.

### Contact

The supplied LinkedIn organization URL is **https://www.linkedin.com/company/116784298/**. Its ownership/current page details have not been independently verified for this package. Use it as the user-supplied contact destination, and do not invent an email address. External links should use safe new-tab behavior and accessible labeling.

### Footer

Keep it small: brand name, the official tagline, and a back-to-top link. No invented legal registrations or claims.

## 10. Responsive behavior and accessibility

- Preserve the desktop screenshot's layout at its reference size.
- For tablets, reduce margins and typography proportionally without forcing overlap.
- For phones, stack the hero copy and exact brain artwork; retain the two-line headline where it fits and use careful natural wrapping on narrower devices.
- Stack exploration columns. Keep the research strip readable without horizontal overflow.
- Use a real mobile navigation button with an accessible name, `aria-expanded` and a controlled navigation region. Close after choosing a link and on Escape; restore focus appropriately.
- Use semantic headings, real links/buttons, a skip link and visible keyboard focus.
- Brain artwork is decorative: avoid misleading scientific/clinical alt text. If it is conveyed as decorative, use empty alt text and retain the tagline as accessible text.
- Honor reduced-motion preferences. Animations are optional; subtle hover states are sufficient.
- No decorative motion should change the approved brain geometry or make the screenshot comparison fail.

## 11. Required verification before handoff

1. Open the implementation in a real browser. Do not substitute a source check for visual verification.
2. Capture the initial viewport at 1536 × 1024, DPR 1, after fonts and assets load.
3. Compare with the correct reference using side-by-side inspection, an overlay, and a difference image. Check brain silhouette/branches/endpoints first, then headline geometry, margins, colors, buttons, header and lower sections.
4. Confirm which expected differences result from the approved combined layout: refined header logo and separate research strip. Do not claim this combination is a byte-identical reproduction of the earlier screenshot.
5. If an asset is extracted, verify its pixels match the original crop exactly at native scale. Lossless PNG is preferred.
6. Test navigation, “Explore our work”, “Meet the team”, project expansion, mobile menu, keyboard focus, external contact and back-to-top behavior.
7. Check at desktop and mobile widths, including 1536, 1280, 768, 390 and 360 CSS pixels, for overflow and broken line wraps.
8. Report any remaining differences honestly. Never state “zero-pixel match” without evidence under documented rendering conditions.

The previous implementation was not successfully inspected in a real browser: the managed preview failed to start, and the private deployed site required authentication. This package makes no claim of a verified pixel-identical implementation. A fresh agent should perform the visual checks above rather than relying on that earlier result.

## 12. Suggested delivery

Provide a portable source folder with HTML, CSS, JavaScript, local images/fonts and a concise README explaining how to run and edit it. Include desktop/mobile visual verification evidence and any remaining fidelity caveats. Do not publish publicly or change domain/visibility unless the user authorizes that separately.

## 13. Short starter instruction for the next agent

> Read this entire BUILD_BRIEF.md and inspect the approved visual resources before writing code. Build Broccoli Brain Lab from scratch using only HTML, CSS and JavaScript. Use the original hero wording and exact branching brain artwork, the approved refined logo, charcoal-and-sage palette, three open exploration columns, and separate research strip from the combined reference. Do not regenerate the assets or invent organizational claims. Implement useful accessible interactions and responsive behavior. Visually compare the finished page against the reference at 1536 × 1024 and report measured differences honestly.
