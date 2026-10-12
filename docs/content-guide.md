# Content guide

Everything the site shows comes from `site/src/data/`. Edit these files; no component needs to change.

## Books — `data/books.js`

```js
{ title: 'Shoe Dog: A Memoir by the Creator of Nike', author: 'Phil Knight', accent: 'clay' }
```

- Order matters: the book marked `current: true` is the focal point of the homepage composition; the rest follow in the order written (newest started first).
- `title` may include a subtitle after the **first colon** — the part before it is the cover/title ("Shoe Dog"), the part after it appears in the focused view.
- `accent` is the cover tone: `ink slate moss sage sand ochre terracotta clay burgundy plum` (colours are defined in `styles/tokens.css`).
- **Real cover art (optional):** add `cover: './assets/covers/shoe-dog.jpg'` (a file in `site/public/assets/covers/`). It is mapped onto the front board without distortion, and the spine/back take its average colour. Without it, a typographic cover is generated from the true title and author. Use a portrait image close to 0.68 : 1 (width : height) for the cleanest result.
- Nothing else is shown: no ratings, dates or notes are invented. (If you later add fields such as a note or a year, show them in `features/readings/focus/FocusDetails.jsx`.)

## Writings — `data/writings.js`

Each entry: `slug`, `title`, `subtitle`, `published` (ISO), `date` (display), `url` (Substack), optional `thumb`.
Subtitles are tidied for display (sentence case, curly apostrophes, no trailing full stop) in `lib/writings.js`; the data stays as typed.

## Homepage curation — `data/home.js`

- `lead` — slug of the featured writing; `support` — slugs of the quieter rows (in display order).
- `shelf` — how many books appear beside the current one (the composition uses up to six on desktop, four on phones).
- The archives always list everything.

## Identity — `data/identity.js`

Name, the one-line voice, email and the "elsewhere" links (footer + hero).

## Homepage composition — `features/readings/collection/compositions.js`

One plan per width (`wide`, `narrow`). Each slot: `pick` (`'current'` or an index into the shelf), `x` (centre, % of stage), `w` (width, %), `y` (lift, rem), `yaw` / `pitch` (resting turn and tilt, radians). Keep one focal book, vary scale and turn, and leave room around every title.

## Assets — `site/public/assets/`

`hardcover.glb` (the book model), `my_painting.webp` (the hero portrait), and any `covers/…` images. After changing anything, run `npm run build` from `site/`.
