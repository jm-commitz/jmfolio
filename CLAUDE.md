# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # run ESLint
npm run start    # serve production build
```

No test suite is configured.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v3 — utility classes plus heavy global CSS in `app/globals.css` and `app/additional-styles.css`
- Framer Motion — page animations, splash screen
- Lenis — smooth scrolling, initialized in `components/ui/SmoothScroll.tsx`
- shadcn primitives in `components/ui/` (Dialog, button)
- Embla Carousel via `embla-carousel-react`

## Architecture

### Routes

- `/` — single portfolio landing page (`app/page.tsx`)
- `/projects` — projects listing (`app/projects/page.tsx`)
- `/projects/[slug]` — individual project detail (`app/projects/[slug]/page.tsx`)

### App shell (`app/layout.tsx`)

Wraps everything in `<SmoothScroll>`, which:
1. Shows `SplashScreen` on first load (Framer Motion exit animation)
2. Initializes Lenis after the splash exits
3. Exposes `HeroIntroContext` — a boolean that gates Hero's reveal animations until the splash is fully gone

### Page composition (`app/page.tsx`)

`app/page.tsx` is `'use client'` and composes the entire homepage directly: `Nav → Hero → Ticker → Arsenal → Interlude → FeaturedProjects → About → Testimonials → WhyChooseMe → Ticker → Footer → PromoCard`. No intermediate page-layer component.

### Feature components

Each section lives in its own folder under `components/`:
- `components/hero/` — `Hero.tsx`, `HeroAsideVisual.tsx` (ASCII art panel), `HeroTechStack.tsx`
- `components/featuredProjects/` — `FeaturedProjects.tsx` + `projectsData.ts` (single source of truth for all projects)
- `components/projects/` — `ProjectsCarousel.tsx`, `ProjectsPageShowcase.tsx` (used by the `/projects` route)
- Other sections: `about/`, `arsenal/`, `footer/`, `nav/`, `testimonials/`, `whyChooseMe/`

### Shared UI (`components/ui/`)

- `SmoothScroll.tsx` — Lenis + splash gate + `HeroIntroContext`
- `SplashScreen.tsx` — animated loading screen (orange, Framer Motion)
- `Cursor.tsx` — custom dot + ring cursor (desktop only, hidden on touch via CSS)
- `PromoCard.tsx` — scroll-triggered promo toast with optional game modal via `<iframe>`
- `MaskedLinesHeadline.tsx` — line-by-line masked text reveal
- `Ticker.tsx`, `Interlude.tsx` — marquee and divider components
- `button.tsx`, `dialog.tsx` — shadcn primitives

## Styling conventions

### CSS custom properties (defined in `app/globals.css`)

```
--bg / --bg2 / --bg3     background layers (#111111 base)
--fg / --fg2 / --fg3     foreground/text layers
--primary                #FF4500 (used as red, yellow, blue, pink aliases)
--green                  #00ff77 (availability indicator)
--D                      Bebas Neue (display/headline font)
--M                      Space Mono (monospace/body font)
--H                      Permanent Marker (handwritten accent)
```

### Global CSS classes (not Tailwind — defined in `globals.css`)

Key classes used directly in JSX:
- `.hero`, `.h-inner`, `.h-col-main`, `.h-col-aside`, `.h-tech-stack` — hero grid layout
- `.h-title`, `.h-desc`, `.h-btns`, `.h-sub` — hero typography
- `.btn-y` / `.btn-o` — primary (filled orange) and outline CTA buttons
- `.avail`, `.avail-dot` — green "available" badge
- `.reveal` — scroll-reveal target; add `.in` via IntersectionObserver to animate
- `.glitch` — CSS glitch effect using `data-g` attribute and `::before`/`::after`
- `.stat`, `.stat-n`, `.stat-l` — stat number blocks
- `.cur`, `.cur-ring` — custom cursor elements
- `.animate-tick` — marquee animation (also `.rev`, `.slow` modifiers)

### Fonts

Three font variables registered in `app/layout.tsx`:
- `var(--font-bebas)` / `var(--D)` — local Bebas Neue (`font/Bebas_Neue/`)
- `var(--font-space-mono)` / `var(--M)` — Space Mono (Google)
- `var(--font-permanent)` / `var(--H)` — Permanent Marker (Google)

Default body font is Space Mono (`font-mono` on `<body>`).

## Key data file

`components/featuredProjects/projectsData.ts` — exports `projects: Project[]` and `getProjectBySlug`. This is the single source of truth for all project content used by both the homepage carousel and the `/projects` route.

## Scroll animation pattern

The `.reveal` class pattern (used throughout Hero):
1. Elements start with `opacity: 0; transform: translateY(32px)` via `.reveal` CSS
2. An `IntersectionObserver` in `Hero.tsx` adds `.in` to trigger transition
3. `data-d` attribute sets `transition-delay` in seconds

Hero animations are additionally gated behind `HeroIntroContext` — do not fire reveal observers until `introReady && enterSweep` are both true.

## Game modal

`PromoCard` triggers when `#arsenal` scrolls into view (once per session via `localStorage`). When the user opens the game, `document.documentElement.dataset.gameModalOpen = '1'` is set — CSS in `globals.css` uses this to hide nav, lock scroll, and disable the custom cursor.

## Notes

- `DEVELOPER_GUIDE.md` and `dale_prime_landing_setup.md` in the root are from a different project (dale_prime_landing) and do not describe this codebase.
- `public/ascii/ascii.txt` is the ASCII portrait used in the hero aside panel.
- Assets follow the pattern: `public/images/projects/` for project screenshots, `public/images/techstack/` for tech logos.
