import { writings as raw } from '../data/writings'
import { home } from '../data/home'
import { tidy } from './text'

/* Newest first, with the casually typed subtitles polished once. */
export const writings = [...raw]
  .sort((a, b) => b.published.localeCompare(a.published))
  .map((w) => ({ ...w, year: w.published.slice(0, 4), blurb: tidy(w.subtitle) }))

const bySlug = (slug) => writings.find((w) => w.slug === slug)

/* Homepage selection — configured in data/home.js. */
export const leadWriting = bySlug(home.lead)
export const supportWritings = home.support.map(bySlug).filter(Boolean)

/* [['2026', [...]], ['2025', [...]]] — the archive's editorial grouping. */
export const writingsByYear = Object.entries(
  writings.reduce((acc, w) => ((acc[w.year] ||= []).push(w), acc), {})
).sort(([a], [b]) => b.localeCompare(a))
