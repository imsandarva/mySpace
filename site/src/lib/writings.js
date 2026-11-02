import published from 'virtual:published-posts'
import { writings as raw } from '../data/writings'
import { sortByPublishedDesc } from './post/order'
import { tidy } from './text'

/* Newest publication day first everywhere this list is shown (home lead, archive, year groups). */
export const writings = sortByPublishedDesc([...published, ...raw])
  .map((w) => ({ ...w, year: w.published.slice(0, 4), blurb: tidy(w.subtitle) }))

/* Homepage: newest piece is the large lead; the next few, still newest first, are the rows. */
const HOME_ROWS = 3
export const leadWriting = writings[0]
export const supportWritings = writings.slice(1, 1 + HOME_ROWS)

/* [['2026', [...]], ['2025', [...]]] — the archive's editorial grouping. */
export const writingsByYear = Object.entries(
  writings.reduce((acc, w) => ((acc[w.year] ||= []).push(w), acc), {})
).sort(([a], [b]) => b.localeCompare(a))
