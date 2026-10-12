import { books as raw } from '../data/books'
import { home } from '../data/home'
import { slugify, splitTitle } from './text'

/* Cover-title size, in units of cover width: the biggest that keeps the longest word and the whole title on the plate. */
const longestWord = (s) => Math.max(...s.split(/\s+/).map((w) => w.length))
const fitFor = (name) => {
  const byWord = 70 / (Math.min(longestWord(name), 10) * 0.56)
  const byArea = Math.sqrt(8800 / name.length)
  return Math.round(Math.min(20, byWord, byArea) * 2) / 2
}

/* Stable per-slug dice: a book keeps its physical character when the shelf grows or reorders. */
const hash = (s) => [...s].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7)
const between = (h, lo, hi) => Math.round((lo + ((h % 1000) / 1000) * (hi - lo)) * 10) / 10
const pick = (h, list) => list[h % list.length]

/* Physical form, in container-width units (the cover is 76 wide): real books differ in height, thickness and how they sit. */
const shapeFor = (slug) => {
  const h = hash(slug)
  return {
    h: between(h, 104, 120),
    d: between(h >>> 3, 11, 15.5),
    ry: between(h >>> 6, 23, 29),
    material: pick(h >>> 9, ['cloth', 'matte', 'board', 'cloth', 'matte']),
    layout: pick(h >>> 12, ['a', 'b', 'c']),
  }
}

const seen = new Map()
const slugFor = (name) => {
  const base = slugify(name)
  const n = (seen.get(base) || 0) + 1
  seen.set(base, n)
  return n > 1 ? `${base}-${n}` : base
}

/* The raw shelf, enriched once: display name, subtitle, unique slug, cover tone, type size and physical form. */
export const books = raw.map((b, index) => {
  const [name, sub] = splitTitle(b.title)
  const slug = slugFor(name)
  return { ...b, index, name, sub, slug, tone: b.accent, fit: fitFor(name), shape: shapeFor(slug) }
})

export const currentBook = books.find((b) => b.current)
export const bookBySlug = (slug) => books.find((b) => b.slug === slug)

/* Books on the homepage shelf, in shelf order — the current book has its own stage. */
export const railBooks = books.filter((b) => !b.current).slice(0, home.shelf)
