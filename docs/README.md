# Sandarva — personal website

A typography-led, editorial personal website: a masthead hero, Writings, and a tactile **3D reading collection**.
React 18 + Vite, hash-routed, deployed as static files.

| Doc | What it covers |
| --- | --- |
| [architecture.md](architecture.md) | Folder map, layering rules, routing, scroll and transitions |
| [design-system.md](design-system.md) | Tokens, type roles, colour, motion language, shared UI |
| [reading-collection.md](reading-collection.md) | The 3D books: engine, GLB contract, covers, focus view, performance, accessibility |
| [content-guide.md](content-guide.md) | How to add writings, books and cover art; how to re-compose the homepage |

## Working on it

```bash
cd site
npm install
npm run dev        # http://localhost:5173
npm run build      # writes index.html + assets/ into the repository root (what gets deployed)
```

- The source lives in `site/`; the **repository root is the build output** (`index.html`, `assets/`). Rebuild before committing a release.
- `site/public/assets/` is copied into the build as-is — that is where `hardcover.glb` and the portrait live.
- Hash routes: `#/` (home), `#/writings`, `#/readings`, and the hidden `#/pin` (Pinterest widget comparison).

## Principles the code follows

1. **Thin composition layers.** `main.jsx` and `App.jsx` only wire modules together; logic lives in small, single-purpose files (none over ~200 lines).
2. **Content is data.** Writings, books, identity and homepage curation are plain files in `src/data/`; nothing is hard-coded into components.
3. **Progressive enhancement.** The 3D layer loads lazily and is optional: without WebGL the page keeps its CSS books, and everything still works.
4. **Quiet by default.** Nothing animates while the visitor is idle; the renderer sleeps when nothing is moving.
