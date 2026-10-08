# jmfolio — Jaymark Ancheta's portfolio

A developer portfolio that behaves like a product: an iOS-style "hello" splash,
a guided Figma-style cursor tour, a three-column desktop layout, App Store-style
project pages with case studies, and live GitHub and Spotify data.

Live at **[jmancheta.cloud](https://www.jmancheta.cloud)**.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS and
Framer Motion.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values (all optional)
npm run dev                  # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Environment variables

Every integration is optional — the site still runs without them and simply
hides the related feature.

| Variable | Used for |
|---|---|
| `GITHUB_TOKEN` | Contribution graph including private contributions (falls back to public data) |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | Now playing, recently played, song mood. Get a refresh token with `node scripts/spotify-refresh-token.mjs <id> <secret>` |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Live "people viewing now" faces (Supabase Realtime presence) |

## Make it yours

Most content lives in small data files — edit these first:

| What | File |
|---|---|
| Projects, case studies, featured order | `components/projects/projectsData.ts` |
| Experience timeline | `components/experience/experienceData.ts` |
| Story highlights | `components/highlights/highlightsData.ts` |
| Tools & technologies | `components/tools/techData.ts` |
| Follow / Message links | `components/hero/profileLinks.ts` |
| Name, role, tagline | `components/hero/Hero.tsx` |
| GitHub username (graph + avatar) | `lib/github.ts` |
| Spotify playlist for visitors | `components/spotify/spotifyConfig.ts` |
| Availability status, CV, timezone | `components/availability/AvailabilityCard.tsx` |
| Guided tour messages | `components/tour/TourCursor.tsx` (`STEPS`) |
| Hover lines for the desktop cursor | `data-say="…"` attributes on elements |

Images go in `public/images/` (projects, highlights, tool logos), your CV in
`public/cv/`, and the music-mode avatar GIFs in `public/hero/`.

## Project structure

```
app/
  layout.tsx            Root layout: theme, background, splash, cursor, floating rail
  page.tsx              Homepage — three columns (profile · projects · GitHub/tools)
  projects/[slug]/      App Store-style project detail page
  api/                  now-playing, recently-played, track-mood (Spotify), avatar
  globals.css           Theme tokens and global effects
components/
  hero/                 Profile, avatar (glow ring, achievement), sticky profile bar
  highlights/           Story circles + Instagram-style story viewer
  experience/           Experience timeline
  availability/         "Open to work" card with local time and CV
  featured/             Featured projects carousel
  projects/             Project list, gallery, device mockups, App Store page parts
  github/               Dot-matrix contribution graph
  tools/                Tools & technologies
  spotify/              Now playing, recently played, playlist mini player
  presence/             Live viewer count
  tour/                 Guided cursor tour + shared cursor parts
  theme/                Theme provider and toggle
  ui/                   Splash, background, scroll columns, cursor, rail, etc.
lib/                    GitHub, Spotify and Supabase helpers
scripts/                One-off helpers (favicon, OG image, Spotify token)
```

## Using this as a template

You're welcome to use this portfolio as a starting point for your own — it's
free and open source under the [LICENSE](LICENSE) (MIT with an attribution
requirement).

**The one condition:** keep the small **"Template by Jaymark Ancheta"** credit
(`components/ui/TemplateCredit.tsx`, shown in the bottom-left corner) visible on
your deployed site. Everything else — content, projects, colours, layout — is
yours to change.

Built something with it? I'd love to see it: open an issue or tag me on
[GitHub](https://github.com/jm-commitz).
