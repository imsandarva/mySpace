# Design system

Colour, space and motion live in `site/src/styles/tokens.css`; every typographic value lives in `type-tokens.css`. Light mode only.

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

Two voices, both self-hosted variable fonts (`@fontsource-variable`, latin subsets fetched by `unicode-range`; ~100 KB total):

| Voice | Family | Job |
| --- | --- | --- |
| Display | **Fraunces** (`opsz` + `wght`) | Identity and editorial moments: the name, section/page titles, writing and book titles, the lede, big numerals, the footer address, lettering on generated book covers |
| Text | **Hanken Grotesk** (`wght`) | Everything functional: navigation, links, buttons, metadata, descriptions, authors, counts |

Why this pair: Fraunces has real personality at large sizes (its optical-size axis draws a high-contrast, quietly literary cut) and stays sturdy at 20–30 px, so one family covers hero and titles. Hanken Grotesk is a warm, open grotesque with a generous x-height — comfortable at 13–16 px and neutral enough to let the serif lead. No third family, no italics.

Everything is in `styles/type-tokens.css` (values) and `styles/type.css` (roles); components only choose a role.

- **Weights** — `--w-regular` 400 · `--w-medium` 500 · `--w-semibold` 600 (cover author only). Large display is 400 (`--w-display`); titles are 500 (`--w-title`). Weight never goes below 400.
- **Scale** (fluid `clamp`, deliberately uneven, each role art-directed): `--fs-name` · `--fs-display` · `--fs-detail` · `--fs-section` · `--fs-feature` · `--fs-title` · `--fs-title-s` · `--fs-lede` · `--fs-body` 16 · `--fs-small` 15 · `--fs-meta` 13.
- **Leading** (`--lh-*`) opens as size drops: 0.92 name → 1.0–1.12 display/titles → 1.36 lede → 1.5–1.6 text.
- **Tracking** (`--ls-*`): the serif tightens as it grows (−0.035em name → −0.01em small titles); the sans stays natural (0) with meta opened a hair (+0.012em). No uppercase labels except lettering on book covers.
- **Measure**: `--measure` 34rem for descriptions and the focused book's words; `--measure-title` 38rem for the lead title. Balanced wrapping (`text-wrap: balance`) on every title, `pretty` on prose.
- **Roles**: `t-name`, `t-display`, `t-detail`, `t-section`, `t-feature` (lead writing, book in hand), `t-title`, `t-title-s`, `t-lede`, `t-small`, `t-meta`, `.count`, `.link`. Sans controls share the composite tokens `--text-ui` and `--text-meta`, so nav, buttons, back links, captions and authors cannot drift apart.
- **Rendering**: `font-optical-sizing: auto` (Fraunces redraws itself per size), kerning and `liga`/`calt` on, tabular figures in counts and dates, lining figures in year/count numerals.
- **Loading**: `fonts.css` declares metric-matched fallback faces (`Fraunces Fallback` over Georgia, `Hanken Fallback` over Arial; size-adjust and ascent/descent overrides computed from the fonts' own metrics) so the swap never reflows the page.
- **Colour**: type is only ever `--ink` (primary), `--ink-2` (descriptions, secondary), `--ink-3` (meta, counts), `--blue` (interactive) — hierarchy comes from size, weight and spacing first, colour second.
- **Book covers** (`three/covers.js`) are set with the same two voices: Fraunces 520 for titles, Hanken Grotesk 600 tracked-open capitals for authors, like a printed jacket. Weights live as constants at the top of that file and mirror the tokens.

To retune the site's voice, change tokens only: swap a family (`--font-display` / `--font-text` + the import in `fonts.css`), or move a rung of the scale.

## Motion language

- One easing (`--ease`), three speeds: `--fast` (180 ms), `--slow` (520 ms), and the 580 ms focus flight. The flight itself uses a gentler curve (`cubic-bezier(0.22, 0.5, 0.2, 1)`) so a large scale reads as the same gesture as the move.
- Things **arrive once** (hero intro), **settle gently** (hover lifts), and **move between pages as the same object** (View Transitions, the focus flight).
- No idle animation anywhere. Under `prefers-reduced-motion` all motion is removed; the site is simply still.

## Shared UI (`src/ui/`)

`Arrow` (one stroke family, four directions) · `SectionHead` (title + count + the one door to a collection) · `PageHead` (archive title) · `Thumb` (reserved aspect box with graceful failure).

## Interaction states

Hover, focus and press are different per element and always precise: text links draw an ultramarine underline; writing rows tint their title; books lift and turn toward you. Focus is one language everywhere — a 2 px ultramarine ring.
