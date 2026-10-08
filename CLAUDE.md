# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Commands

```bash
npm run dev      # dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint
npm run start    # serve the production build
```

No test suite. Verify changes with `npx tsc --noEmit`, `npm run lint` and `npm run build`.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v3, Framer Motion,
Embla Carousel, next-themes, lucide-react. Integrations: GitHub GraphQL,
Spotify Web API, Supabase Realtime (presence). See `.env.example`.

## Architecture

### Routes
- `/` — `app/page.tsx`: homepage. Mobile stacks everything; desktop (lg) is a
  full-height 3-column grid where each column is its own scroller
  (`components/ui/ScrollColumn.tsx`, which also fades content as it scrolls off
  the top). Left: profile, highlights, experience, availability, recently
  played. Middle: featured carousel, projects. Right: GitHub graph, tools.
- `/projects/[slug]` — App Store-style project page (statically generated from
  `projectsData.ts`).
- `/api/*` — `now-playing`, `recently-played`, `track-mood` (Spotify) and
  `avatar/[seed]` (DiceBear faces for viewer presence).

### Root layout (`app/layout.tsx`)
Theme provider, `PageBackground` (canvas dot grid + streaks), `HelloSplash`,
`ConsoleGreeting` (DevTools art), `TemplateCredit`, `CursorFollower` (desktop
custom cursor) and the bottom-right `FloatingRail` (viewers, Spotify, theme).

### Data files (content lives here)
- `components/projects/projectsData.ts` — projects, case studies, `featured` order
- `components/experience/experienceData.ts`
- `components/highlights/highlightsData.ts`
- `components/tools/techData.ts`
- `components/hero/profileLinks.ts`, `lib/github.ts` (username), `components/spotify/spotifyConfig.ts`

### Interaction systems
- **Splash → tour:** `HelloSplash` signals `hello-splash-drawn` / `hello-splash-done`;
  `components/tour/TourCursor.tsx` runs the guided tour over `[data-tour="…"]` targets
  (optional `[data-tour-spot]` to choose what enlarges).
- **Visitor cursor:** `components/ui/CursorFollower.tsx` (desktop only) shows a
  typing bubble for any element with `data-say="…"`. Shared cursor UI lives in
  `components/tour/cursorParts.tsx`.
- **Spotify:** `useNowPlaying` (owner), `visitorPlayback` store (visitor playing the
  playlist embed) → avatar GIF mood, song bubble, rail album art.

## Conventions
- Colours come from CSS variables in `app/globals.css` (`--background`,
  `--foreground`, `--muted`, …) — the design is monochrome; use `var(--…)`, not
  hard-coded colours (the gold achievement toast is the one deliberate exception).
- Effects respect `prefers-reduced-motion`.
- Fixed overlays that must escape the columns' transforms are portaled to `<body>`.
- Keep the attribution credit (`components/ui/TemplateCredit.tsx`) — required by the LICENSE.
