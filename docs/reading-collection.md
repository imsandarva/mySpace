# The 3D reading collection

Real-time hardcover books, built from one reusable model (`hardcover.glb`). On the homepage they sit in the earlier shelf:
the current book large beside its title and the hand-drawn **Currently** ring, then a scrollable rail (“More from the shelf”).
The archive lists every book in a grid. Opening one still flies into the focused view, which is the only place a book can be turned.
Everything lives in `site/src/features/readings/`.

```
features/readings/
  ReadingsPreview.jsx   homepage section: heading + Shelf + inline FocusLayer
  Shelf.jsx             current book + rail (ui/Rail)
  CurrentBook.jsx       featured 3D book, Currently ring, title, author
  AllTile.jsx           last rail stop — link to the archive
  ReadingsPage.jsx      archive page: ArchiveGrid + fixed FocusLayer
  collection/           BookSlot (one 3D book), ArchiveGrid; compositions.js / Collection.jsx are unused by the homepage
  focus/                focusStore, FocusLayer, FocusSheet, FocusScrim, FocusDetails, FocusTools, useRotate, useRotateHint, rotateHint, flip
  view/                 engineStore (lazy load), BookView (puts a book into a DOM box)
  three/                the 3D layer: engine, rig, poseScript, model, studio, covers, materials, tones, capability, index
  book/                 BookFlat — the flat cover shown only on devices without WebGL
```

## How it fits together

1. **One shared canvas** (`three/engine.js`). A single fixed, pointer-transparent `<canvas class="gl-canvas">` sits above page content and below the header.
   Each book is a *view*: a DOM element plus a scene. Every frame the engine reads each element's rectangle and draws that book into it (scissored viewport).
   Layout, scrolling and CSS animation therefore drive the 3D for free, and one WebGL context serves the whole site.
2. **Render on demand.** The engine draws only while something is moving (a pose settling, a drag, a flight) and only for views on screen. Idle page = zero frames.
3. **Lazy, with no stand-in.** `view/engineStore.js` imports the 3D layer right after first paint (idle, 250 ms at most) and only if WebGL2 exists (and the visitor hasn't asked to save data). Each slot's box (`.slot-box`, fixed aspect ratio) reserves the book's space from the first paint, so nothing shifts. It stays empty until its book is ready, then the book rises out of the page colour — there is **no placeholder that is later swapped for the real thing**. Slot words (author caption, "Currently reading") appear with their book. Only when WebGL is unavailable (or the load fails) is a flat typographic cover (`book/BookFlat.jsx`) shown — instead of, never alongside, the 3D book.
4. **Slots are real buttons** (`collection/BookSlot.jsx`): keyboard focus, screen-reader names and the focus ring come from the DOM. Hover or keyboard focus lifts the 3D book; click opens it.

## The model contract (`hardcover.glb`)

One closed hardcover, ≈ 15.7 × 23 × 3 cm, pivot at its centre, front facing +z, spine on the left. Meshes (and material names): `Front`, `Back`, `Spine`, `Pages`.
Front/Back/Spine start neutral grey; `Pages` is ivory. UVs: Front/Back span 0–1 (the back's spine edge is on the right); the Spine runs back-edge → front-edge.
All artwork is therefore drawn **upright**, with `flipY = false` (glTF UVs start top-left).

`three/model.js` loads it once and clones per book. A book's thickness is varied by scaling only the model's depth (`shape.d`), so heft varies while cover proportions stay true.

## Surfaces

`three/covers.js` paints each book's surfaces to canvases; `three/materials.js` turns them into per-book materials:

- **Real artwork wins.** If a book has `cover` (a URL) it is centre-cropped to the board's proportions — never stretched — and the spine/back take its average colour.
- **Otherwise** a typographic cover is set from the book's *true* title and author in Fraunces / Instrument Sans, in one of three layouts (`a` top-left, `b` framed and centred, `c` label) and one of three materials (`cloth`, `matte`, `board`) — chosen stably from the slug so a book never changes character.
- The **back** is a plain material colour; the **page block** stays ivory (dimmed so the top edge never blows out).
- Texture size is a tier: `lg` 1024 (focus), `md` 640 (homepage), `sm` 384 (archive).

## Lighting and framing (`three/studio.js`)

Soft image-based light from a procedural room (nothing to download), one gentle key light, no tone mapping (covers keep their true colour),
and a fixed three-quarter camera (FOV 24°, restrained perspective). The contact shadow is a soft ellipse in its **own pass underneath the book** (transparent objects would otherwise draw over it), sized to stay inside the view so it is never clipped.
Fading a book raises a **veil in the page's own colour** instead of making materials transparent — the book stays solid and simply dissolves into the paper.

## Interaction

- **Rest:** still. No idle motion.
- **Hover / keyboard focus:** lifts slightly, comes forward, turns a touch toward you; shadow tightens. Neighbours do not move.
- **Select (`focus/`):** the book's box *flies* (FLIP) from its place in the collection to its place in the focused view while the 3D book eases between poses. A **paper scrim** (`FocusScrim`, z-index 14) fades in under the focus chrome so the visitor sees a plain field, not the grid behind. Other books **dissolve on the shared canvas** (`faded`) but stay built (`useShelfPresence` in `hooks/`) so closing never rebuilds the shelf. The shelf copy of the opened book hides for the whole trip, including the flight home, so only one copy moves. The words arrive after it lands. Nothing navigates — selection is state (`focusStore`), not a route. Archive: scroll locked while open.
- **Rotate:** drag (mouse, pen, touch) turns it about its own axes; arrow keys nudge it. It holds where you leave it (no inertia, no auto-spin). Pitch stops just short of vertical, so top and bottom edges are reachable but the controls never flip. `touch-action: none` applies only to the book's box — everywhere else the page scrolls normally. **Reset view** (discreet icon) returns to the three-quarter pose by the shortest way. On first open, **500 ms after opening** focus, a short **opening dance** (`rotateHint` → `BookRig.beginPoseScript` + `poseScript`) sways the book through a smooth keyframed path and leaves it on a slightly new pose (no snap-back); drag or arrow keys cancel the script — skipped if the visitor already rotated, or under `prefers-reduced-motion`.
- **Close:** `Back to collection`, or **Escape**. Chrome fades but the flying book stays visible; the focus box plays the open flight in reverse using **`held` / `homeTransform`** (snapped when the open flight lands) so scale matches the slot. The shelf twin stays hidden until `release()`, then neighbours fade back in. Scroll position and arrangement are untouched, and keyboard focus returns to that book. Leaving the page closes it.
- Homepage: the focused view is **inline** in the Readings section (scrim covers only that stage). Archive: it fills the viewport under the header. Same component, `placement` differs.

## Performance

- `three` is its own lazy chunk (~157 KB gzipped); the initial bundle is unaffected. The model is 11 KB.
- One WebGL context, one canvas, DPR capped at 2, render-on-demand, off-screen views skipped.
- Archive books are built only while within ~600 px of the viewport (`hooks/useNearViewport`) and disposed when far away.
- Textures are tiered and disposed with their book.

## Accessibility

Each slot is a `<button>` named "Title, Author. Open"; the canvas is `aria-hidden`. The focused view is a labelled region; the title receives focus on landing.
The book's box is a focusable group ("Drag, or use the arrow keys, to rotate"). Escape closes. Reduced motion removes flights and fades and makes poses snap. If 3D is unavailable the focused view shows the flat cover and all text.

## Extending

- **Change which books appear on the homepage rail:** `data/home.js` (`shelf` = how many follow the current book). The current book is whichever entry has `current: true`.
- **Change the model:** replace `site/public/assets/hardcover.glb`, keeping mesh names and UV conventions above.
- **Change materials/typography of generated covers:** `three/covers.js`; colours in `styles/tokens.css`.
- **Debugging:** in dev, `window.__books` exposes the engine (views, frame state).
