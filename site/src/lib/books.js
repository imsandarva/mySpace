import { books as raw } from '../data/books'
import { home } from '../data/home'
import { slugify, splitTitle } from './text'

/* Cover-title size in container-width units: biggest that keeps the longest word and the whole title inside the plate. */
const longestWord = (s) => Math.max(...s.split(/\s+/).map((w) => w.length))
const fitFor = (name) => {
  const byWord = 70 / (Math.min(longestWord(name), 10) * 0.56)
  const byArea = Math.sqrt(8800 / name.length)
  return Math.round(Math.min(20, byWord, byArea) * 2) / 2
}

/* Stable 0/1 per slug, so a book keeps its cover layout when the shelf changes. */
const variantFor = (slug) => [...slug].reduce((n, c) => n + c.charCodeAt(0), 0) % 2

const seen = new Map()
const slugFor = (name) => {
  const base = slugify(name)
  const n = (seen.get(base) || 0) + 1
  seen.set(base, n)
  return n > 1 ? `${base}-${n}` : base
}

/* The raw shelf, enriched once: display name, subtitle, unique slug, cover tone and sizing. */
export const books = raw.map((b, index) => {
  const [name, sub] = splitTitle(b.title)
  const slug = slugFor(name)
  return { ...b, index, name, sub, slug, tone: b.accent, fit: fitFor(name), variant: variantFor(slug) }
})

export const currentBook = books.find((b) => b.current)

/* Books on the homepage shelf, in shelf order — the current book has its own stage. */
export const railBooks = books.filter((b) => !b.current).slice(0, home.shelf)

/* Only books that exist on both the homepage and the archive get a shared-element name. */
const shared = new Set([currentBook, ...railBooks].filter(Boolean).map((b) => b.slug))
export const sharedName = (slug) => (shared.has(slug) ? `book-${slug}` : undefined)
