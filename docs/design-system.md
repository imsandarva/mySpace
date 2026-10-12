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
The 3D layer reads them from there (`three/tones.js`), so one edit recolours the CSS book and the 3D book together.
`data/books.js` picks a tone per book via `accent`.

## Typography

- **Fraunces** (serif) carries voice and titles; **Instrument Sans** carries information.
- Roles (`styles/type.css`): `t-name`, `t-display`, `t-section`, `t-title`, `t-title-s`, `t-detail`, `t-lede`, `t-meta`, `.count`, `.link`.
- Sizes are fluid (`clamp`) and deliberately uneven; the contrast between roles *is* the hierarchy.
- Never use italics (the italic face isn't loaded). Numerals in counts are tabular.

## Motion language

- One easing (`--ease`), three speeds: `--fast` (180 ms), `--slow` (520 ms), and the 580 ms focus flight.
- Things **arrive once** (hero intro), **settle gently** (hover lifts), and **move between pages as the same object** (View Transitions, the focus flight).
- No idle animation anywhere. Under `prefers-reduced-motion` all motion is removed; the site is simply still.

## Shared UI (`src/ui/`)

`Arrow` (one stroke family, four directions) · `SectionHead` (title + count + the one door to a collection) · `PageHead` (archive title) · `Thumb` (reserved aspect box with graceful failure).

## Interaction states

Hover, focus and press are different per element and always precise: text links draw an ultramarine underline; writing rows tint their title; books lift and turn toward you. Focus is one language everywhere — a 2 px ultramarine ring.
