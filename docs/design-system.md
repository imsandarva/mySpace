# Design system

All values live in `site/src/styles/tokens.css`. Light mode only.

## Colour

| Token | Use |
| --- | --- |
| `--paper` `#f8f5ef`, `--paper-deep` `#f0ebe1` | Page surface; the Readings band |
| `--ink` `#12162b`, `--ink-2`, `--ink-3` | Blue-black text, secondary, meta (all AA on paper) |
| `--blue` `#2a3db3` | Ultramarine — what you can act on (links, focus ring, hover) |
| `--marigold` `#e9892a` | What is alive — the "currently reading" dot. Never used for text |
| `--rule`, `--rule-strong` | Hairlines |

Book-cloth tones (`[data-tone='…']`: ink, slate, moss, sage, sand, ochre, terracotta, clay, burgundy, plum) are defined **once, in CSS**.
The 3D layer reads them from there (`three/tones.js`), as does the flat fallback cover, so one edit recolours both.
`data/books.js` picks a tone per book via `accent`.

## Typography

- One family: **Inter Variable** with an optical-size axis (`@fontsource-variable/inter/opsz.css`). `--font` is the source; `--serif` and `--sans` alias it so every role stays Inter.
- Hierarchy is size, weight, tracking, and colour. Display (name, section, titles) sits at 520–580 with tight tracking; body is 400 at −0.011em; ledes are 450; UI and meta are 500, with meta tracked slightly open. Line-height opens as size drops.
- `liga` and `calt` are on; `font-optical-sizing` is auto, so large Inter draws its display cut and small Inter stays readable.
- Roles (`styles/type.css`): `t-name`, `t-display`, `t-section`, `t-title`, `t-title-s`, `t-detail`, `t-lede`, `t-meta`, `.count`, `.link`.
- Sizes are fluid (`clamp`) and deliberately uneven.
- Italics are not loaded. Numerals in counts are tabular.

## Motion language

- One easing (`--ease`), three speeds: `--fast` (180 ms), `--slow` (520 ms), and the 580 ms focus flight.
- Things **arrive once** (hero intro), **settle gently** (hover lifts), and **move between pages as the same object** (View Transitions, the focus flight).
- No idle animation anywhere. Under `prefers-reduced-motion` all motion is removed; the site is simply still.

## Shared UI (`src/ui/`)

`Arrow` (one stroke family, four directions) · `SectionHead` (title + count + the one door to a collection) · `PageHead` (archive title) · `Thumb` (reserved aspect box with graceful failure).

## Interaction states

Hover, focus and press are different per element and always precise: text links draw an ultramarine underline; writing rows tint their title; books lift and turn toward you. Focus is one language everywhere — a 2 px ultramarine ring.
