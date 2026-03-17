# Dale Prime Landing Developer Guide

## Purpose

This document is the working developer guide for `/home/itsaldev/dale_prime/dale_prime_landing`.

It explains:

- the current implemented structure
- which folders are the source of truth
- how to add a new page without breaking the existing architecture
- how to decide where a new component belongs
- how to use shadcn correctly in this codebase
- how to handle styling, assets, typography, and small implementation details

This guide is meant to be practical. A developer should be able to open this file, understand how the project is organized, and continue building without guessing.

## Current Project Context

This project is a `Next.js 16` app using:

- `App Router`
- `TypeScript`
- `Tailwind CSS v4`
- `shadcn` with `radix-nova`
- `radix-ui` primitives
- `framer-motion` for optional motion work
- `next/image` for visual assets

The project currently serves a single public landing page at `/`, but it is now organized in a way that supports more pages without mixing route logic, page composition, and reusable UI.

## Important Note About Existing Docs

Two files in the root are older bootstrap/setup docs:

- `README.md`
- `dale_prime_landing_setup.md`

They are useful for historical setup context, but they are **not** the authoritative source for the current app structure anymore.

Use this file as the structure and implementation guide going forward.

## Current Structure Snapshot

Only the important tracked source folders are shown below.

```text
dale_prime_landing/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── JsonLd.tsx
│   ├── Hero.tsx                       # legacy placeholder, do not extend
│   ├── home/
│   │   ├── AboutSpace.tsx            # legacy placeholder, do not extend
│   │   ├── EasySection.tsx           # legacy placeholder, do not extend
│   │   ├── Gallery.tsx               # legacy placeholder, do not extend
│   │   ├── Hero.tsx                  # legacy placeholder, do not extend
│   │   ├── Units/                    # legacy placeholder, do not extend
│   │   └── landing-page/             # compatibility wrappers only
│   ├── landing/                      # source of truth for landing feature
│   │   ├── blocks/
│   │   ├── data/
│   │   ├── sections/
│   │   ├── shared/
│   │   └── types.ts
│   ├── layout/
│   │   └── Footer.tsx                # legacy placeholder, do not extend
│   ├── pages/
│   │   └── landing/
│   │       └── LandingPage.tsx
│   └── ui/
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── input.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       └── tabs.tsx
├── font/
│   └── Bricolage/
├── lib/
│   └── utils.ts
├── public/
│   ├── images/
│   │   ├── DalePrimeHomePage.png
│   │   ├── landing/
│   │   └── og-cover.jpg
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── components.json
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Source of Truth vs Legacy

This is one of the most important things to understand.

### Source of truth

These folders/files are the current real implementation:

- `app/`
- `components/pages/`
- `components/landing/`
- `components/ui/`
- `lib/utils.ts`
- `public/images/landing/`

### Compatibility layer

`components/home/landing-page/` exists to keep old imports working during the refactor.

Those files currently act as wrappers/re-exports. They are **not** the place to continue new development.

### Legacy placeholder code

These are older scaffold-style components and should not be extended for new work:

- `components/Hero.tsx`
- `components/home/AboutSpace.tsx`
- `components/home/EasySection.tsx`
- `components/home/Gallery.tsx`
- `components/home/Hero.tsx`
- `components/home/Units/*`
- `components/layout/Footer.tsx`

If you build on top of those files, the architecture will drift backward again.

## Architecture Rules

The app now follows a layered structure inspired by the CRM analysis:

### 1. Routing layer

Folder:

- `app/`

Responsibility:

- route entrypoints only
- route-level metadata
- layout registration
- global CSS import

What belongs here:

- `app/page.tsx`
- `app/layout.tsx`
- route-specific `loading.tsx`, `not-found.tsx`, `error.tsx`, `template.tsx` if needed later

What should **not** belong here:

- section composition
- large JSX trees for page content
- repeated CTA markup
- page data definitions

Rule:

`app/page.tsx` should stay extremely thin and should mostly render a page-layer component.

### 2. Page layer

Folder:

- `components/pages/`

Responsibility:

- page composition only
- section order
- layout rhythm
- data wiring from local page data to feature sections

Example:

- `components/pages/landing/LandingPage.tsx`

What belongs here:

- importing section components
- mapping over page section data
- setting page-level font class for a specific page
- high-level container structure

What should **not** belong here:

- fine-grained reusable UI
- low-level shadcn primitive definitions
- route metadata
- large mock-data declarations

### 3. Feature/component layer

Folders:

- `components/landing/sections/`
- `components/landing/blocks/`
- `components/landing/data/`
- `components/landing/shared/`
- `components/landing/types.ts`

Responsibility:

- reusable feature-specific sections and building blocks
- typed mock data
- shared landing tokens
- landing-specific types

The split inside `components/landing/` is:

- `sections/`
  Large visible slices of the page such as `HeroSection`, `AboutSection`, `GallerySection`.
- `blocks/`
  Smaller reusable subcomponents such as `LandingButton`, `BookingCard`, `HeroStatRow`, `LocationTagPill`.
- `data/`
  Static landing data and placeholder content.
- `shared/`
  Shared constants and helper tokens that belong to the landing feature.
- `types.ts`
  Shared types for the landing feature.

### 4. Shared UI layer

Folder:

- `components/ui/`

Responsibility:

- shared reusable primitives
- shadcn-style building blocks
- components that can be reused by multiple pages or features

Examples:

- `button.tsx`
- `input.tsx`
- `card.tsx`
- `tabs.tsx`
- `sheet.tsx`
- `carousel.tsx`

Rule:

If a UI primitive could reasonably be reused by another page, it belongs in `components/ui`, not inside a feature folder.

## How the Current Homepage Flows

The current homepage pipeline is:

1. `app/page.tsx`
2. `components/pages/landing/LandingPage.tsx`
3. `components/landing/data/mock-data.ts`
4. `components/landing/sections/*`
5. `components/landing/blocks/*`
6. `components/ui/*`

This direction matters:

- routes call pages
- pages call sections
- sections call blocks or shared UI
- blocks may call shared UI
- data is fed downward through typed props

Try to keep dependencies flowing in that direction only.

## How to Add Another Page

When creating a new page, follow this exact pattern.

### Step 1: Create the route

Example:

```text
app/about/page.tsx
```

That file should be thin:

```tsx
import AboutPage from "@/components/pages/about/AboutPage"

export default function Page() {
  return <AboutPage />
}
```

### Step 2: Create the page-layer component

Example:

```text
components/pages/about/AboutPage.tsx
```

This file should:

- orchestrate the page
- import feature sections
- own page-level composition
- keep top-level containers readable

### Step 3: Create a feature folder if the page is substantial

If the page has multiple sections or custom UI, create a domain folder:

```text
components/about/
├── blocks/
├── data/
├── sections/
├── shared/
└── types.ts
```

Use the same pattern as `components/landing/`.

### Step 4: Only move to `components/ui/` if it is truly shared

Do **not** add everything to `components/ui/`.

Move something to `components/ui/` only when:

- it is generic
- it is design-system style
- another page could use it without knowing landing-specific context

### Step 5: Keep route logic out of feature code

A feature section should not know it is being rendered by `app/about/page.tsx`.

It should only receive props.

## How to Decide Where a New Component Goes

Use this decision guide.

### Put it in `components/ui/` when:

- it is a primitive like button, card, input, tabs, sheet, badge
- it is reusable across multiple features
- it is not tied to landing-specific copy, layout, or tokens

Examples:

- button variants
- generic sheet/drawer
- shared tabs wrapper
- generic card shell

### Put it in `components/landing/blocks/` when:

- it is reusable within the landing feature
- it is smaller than a full page section
- it contains landing-specific visuals or semantics

Examples:

- booking card
- stat row
- unit meta chips
- location tag pill
- landing CTA wrapper

### Put it in `components/landing/sections/` when:

- it is a visually distinct section of the landing page
- it represents one major chunk of the page

Examples:

- hero
- unit list section
- gallery
- testimonials section

### Put it in `components/pages/<page>/` when:

- it is page composition only
- it mainly wires sections together

### Do not put new code in `components/home/landing-page/`

That folder is compatibility glue.

## shadcn Usage Guidelines

This project should be shadcn-first for reusable UI.

### Preferred approach

When building a new reusable UI piece:

1. check `components/ui/` first
2. extend an existing primitive if possible
3. only create a new primitive when the current set cannot represent the need cleanly

### Current reusable UI already available

- `Button`
- `Input`
- `Card`
- `Badge`
- `Avatar`
- `Tabs`
- `Separator`
- `Sheet`
- `Carousel`

### Landing-specific CTA guidance

Do **not** write raw repeated CTA button styles if the button matches current landing button patterns.

Use:

- `components/landing/blocks/LandingButton.tsx`

Backed by variants added in:

- `components/ui/button.tsx`

Current landing button intents:

- `landingAccent`
- `landingSuccess`
- `landingOutlineSoft`

Rule:

If a new button is one of the existing landing styles, use `LandingButton`.
If it introduces a new repeated button style, extend `Button` variants first instead of scattering raw Tailwind classes.

### When raw HTML is acceptable

A plain element like `div`, `section`, `ul`, or `p` is fine when it is semantic structure only.

But for repeated interactive UI such as:

- buttons
- inputs
- tabs
- drawers
- badges
- cards

prefer the shared shadcn-based component.

## Styling and Token Guidelines

### Global style source

- `app/globals.css`

This file owns:

- Tailwind imports
- shadcn Tailwind import
- global font registration
- theme variables
- landing CSS variables
- shared utility classes such as `landing-page`, `landing-hero-card`, and hero tab underline styles

### Feature token source

- `components/landing/shared/tokens.ts`

This file should contain repeated landing layout tokens and feature-level class strings that improve consistency.

Current examples:

- root page class
- main container class
- body container class
- heading and text token classes
- location tag tone classes

### Rule for hardcoded values

Hardcoding is acceptable only when:

- the value is truly one-off
- it is part of precise visual matching
- extracting it would make the code noisier than clearer

If the same color, shadow, radius, or spacing appears more than once, prefer moving it to:

- `app/globals.css` if it should be a CSS variable or utility
- `components/landing/shared/tokens.ts` if it is a reusable feature-level class token

### Typography guidance

There are two font layers right now:

- global app font: `Bricolage Grotesque` through `app/globals.css`
- landing page font override: `Inter` inside `components/pages/landing/LandingPage.tsx`

Rule:

- Do not randomly mix fonts inside sections.
- If a page needs a distinct font identity, apply it at the page layer, not ad hoc inside individual section components.

### Spacing guidance

Keep page-level spacing decisions in the page layer or feature tokens.

Avoid repeating large container strings inline across many files.

## Asset and Image Guidelines

This project already uses `public/images/landing/` for landing-specific assets. Continue that pattern.

### Where to place assets

- Landing-only assets: `public/images/landing/`
- Shared/global site assets: `public/images/`
- Generic framework/sample icons like `next.svg` are not product assets and should not be reused in actual UI

### File type rules

Use `SVG` when:

- the asset is a logo
- the asset is an icon
- the asset is a flat illustration
- the asset is vector placeholder art
- the asset must remain extremely crisp at different sizes

Use `PNG` when:

- you need transparency
- the image is a cutout or layered composition
- exporting as vector is not realistic

Current examples:

- `hero-building.png`
- `hero-team.png`

Use `JPG` or `WebP` when:

- the image is a real photograph
- the image contains rich texture, lighting, or natural detail
- file size matters

For real estate and room photography, `WebP` or `JPG` is usually the right answer.
Do **not** convert a real photo into `SVG` just to make it "sharp". That usually makes the asset worse, not better.

### Practical rule of thumb

- logo/icon/illustration: `SVG`
- cutout transparent image: `PNG`
- room/property/team photograph: `WebP` or `JPG`

### Asset quality rules

- Export only what the page needs. Do not commit giant screenshots if cropped assets will do.
- Keep filenames descriptive and kebab-case, for example:
  - `city-view-bedroom.webp`
  - `brand-mark.svg`
  - `hero-team-cutout.png`
- Always provide meaningful `alt` text.
- Use `next/image` for raster images and layout-controlled visual assets.
- Add a `sizes` prop whenever the image is responsive.

### SVG details

For SVGs:

- keep the SVG clean and optimized
- remove editor junk when possible
- prefer viewBox-based scalable SVGs
- avoid huge embedded raster payloads inside SVGs unless absolutely necessary

## Mock Data, Types, and Content Rules

### Types

Put feature-specific shared types in:

- `components/<feature>/types.ts`

For the landing page, that is:

- `components/landing/types.ts`

### Mock data

Put static content and placeholder content in:

- `components/<feature>/data/mock-data.ts`

Rule:

- Pages wire data
- Sections receive typed props
- Sections should not secretly own page content when the content is reusable or repeated

This keeps UI and content easier to update independently.

## Server vs Client Component Guidance

Default to a server component.

Add `"use client"` only when the component needs:

- browser APIs
- local interactive state
- event-driven behavior that requires client execution
- framer-motion animation
- carousel APIs
- any hook that only works on the client

Current example:

- `components/ui/carousel.tsx` is a client component because it uses hooks and Embla.

Guideline:

Keep the client boundary as small as possible. If only one small interactive part needs the client, isolate that part into a leaf component instead of converting an entire page or section.

## SEO and App-Level Responsibilities

### Metadata

Global metadata lives in:

- `app/layout.tsx`

Current metadata includes:

- title
- description
- keywords
- Open Graph
- Twitter card

### Structured data

JSON-LD lives in:

- `components/JsonLd.tsx`

and is injected from:

- `app/layout.tsx`

Rule:

Do not duplicate SEO logic inside feature sections.
If a future route needs page-specific metadata, define that at the route level in `app/<route>/page.tsx` or a route-level metadata export.

## Naming Conventions

Use these conventions for new work:

- folders: `kebab-case`
- component files: `PascalCase.tsx`
- data files: `mock-data.ts`
- type files: `types.ts`
- utility files: descriptive lowercase or kebab-case
- public assets: `kebab-case`

Examples:

- `components/pages/about/AboutPage.tsx`
- `components/about/sections/StorySection.tsx`
- `components/about/blocks/MetricPill.tsx`
- `public/images/about/team-photo.webp`

## Practical Do and Do Not Rules

### Do

- Keep `app/` files thin.
- Put composition in `components/pages/`.
- Put landing feature code in `components/landing/`.
- Reuse `LandingButton` for existing CTA styles.
- Reuse `components/ui/*` before creating new primitives.
- Keep compatibility wrappers untouched unless removing them intentionally in a cleanup pass.
- Use typed props between pages, sections, and blocks.
- Preserve visual tokens before introducing new ad hoc classes.

### Do not

- Build new features in `components/home/landing-page/`.
- Add large page JSX trees directly in `app/page.tsx`.
- Scatter new button styles as raw Tailwind everywhere.
- Put page-specific content into `components/ui/`.
- Treat old placeholder files as living architecture.
- Use giant uncropped image exports when a focused asset is enough.

## Recommended Workflow for New UI Work

When adding or changing a page:

1. Identify the route entry in `app/`.
2. Create or update the matching page-layer component in `components/pages/`.
3. If the page is substantial, create a feature folder like `components/<feature>/`.
4. Add or update types in `types.ts`.
5. Add mock/static data in `data/mock-data.ts` if needed.
6. Build sections from blocks and shared UI.
7. Extend shadcn primitives if a repeated UI pattern appears.
8. Run:
   - `npm run lint`
   - `npm run build`
9. Check the page visually at mobile, tablet, and desktop.

## Visual QA Checklist

Before considering a UI task finished, check:

- spacing and alignment
- heading hierarchy
- button sizes and corner radius
- font consistency
- color usage against existing tokens
- image cropping and sharpness
- mobile overflow
- desktop max-width rhythm
- hover and focus states
- console errors and hydration issues

## Current Development Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Final Guidance

If you only remember five rules, remember these:

1. `app/` is for routes, not page markup.
2. `components/pages/` owns page composition.
3. `components/landing/` is the landing feature source of truth.
4. `components/ui/` is for shared shadcn-based primitives.
5. `components/home/landing-page/` is compatibility only, not the future.

If a future developer follows those five rules, this project will stay organized as it grows.
