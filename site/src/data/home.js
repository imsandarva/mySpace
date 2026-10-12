/* Homepage curation — which pieces are shown, kept apart from the content itself.
   Edit this file to change the front page; the archives always show everything. */

export const home = {
  /* Writings: one featured piece, then a short supporting list (slugs, in display order). */
  lead: 'emergence-properties',
  support: ['election-2026-of-nepal', 'what-we-get-from-reading-a-book', 'by-endurance-we-conquer'],

  /* Readings: how many books sit beside the current one (the composition in features/readings/collection/compositions.js
     uses the first six on desktop and the first four on phones). */
  shelf: 6,
}
