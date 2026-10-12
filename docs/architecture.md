# Architecture

## Layers

```
main.jsx ─ App.jsx                      composition only
  app/        routing, shell (header/footer), scroll policy
  features/   one folder per product area (home, writings, readings, pin)
  ui/         small shared components (Arrow, SectionHead, PageHead, Thumb)
  hooks/      generic hooks (useMedia, useNearViewport)
  lib/        pure helpers and derived data (books, writings, text, links, viewTransition)
  data/       the content itself (books, writings, identity, home curation)
  styles/     tokens → base → type → layout → chrome → feature stylesheets
```

Rules: a layer may import from layers below it, never above. `data/` imports nothing; `lib/` derives from `data/`;
features compose `ui/`, `hooks/` and `lib/`.

## Routing (`src/app/`)

- `routes.js` — the route table (regex per route). Unknown paths fall back to home. Opening a book is **not** a route: it is a state of the page it was opened from.
- `useRoute.js` — keeps route state in sync with `location.hash`. Every change runs inside a native **View Transition** (`lib/viewTransition.js`), skipped under reduced motion.
- `scroll.js` — scroll policy: home resumes where you left it; every other page starts at the top.
- `views.js` — route name → page component. Adding a page = one row in `routes.js` + one line here.
- `Shell.jsx` — skip link, `SiteHeader`, `<main>`, `SiteFooter`; sets `document.title`.

## Features

| Folder | Responsibility |
| --- | --- |
| `features/home` | `HomePage` (hero → writings → readings), `Hero`, one-time intro flag |
| `features/writings` | Preview (lead + rows), archive grouped by year, shared `WritingItem` |
| `features/readings` | The 3D collection — see [reading-collection.md](reading-collection.md) |
| `features/pin` | Hidden Pinterest widget comparison (`#/pin`), outside the shell |

## Styles

Plain CSS, split by responsibility, imported in order from `styles/index.css`:
`tokens` (all design values) → `base` → `type` (typographic roles) → `layout` → `chrome` (header/footer) → `hero` → `writings` → `readings` (collection, slots, archive) → `focus` → `motion` → `pin`.
Fonts are self-hosted via `@fontsource-variable` (Fraunces, Instrument Sans).

## Build

Vite builds into the repository root (`outDir: ../`, `emptyOutDir: false`, `base: './'`), so the site works from any static host or sub-path.
`three` is split into its own `three-*.js` chunk and is only requested after the page is idle.
