import { writings as elsewhere } from '../src/data/writings.js'
import { toEntry } from '../src/lib/post/entry.js'
import { tidy } from '../src/lib/text.js'

/* "More writing" at the end of a piece. Nothing is claimed to be related: it is simply what comes next in the collection
   (newest first, the same order as the Writings page), wrapping round to the newest when the piece is the oldest. */
const COUNT = 3

export const moreWriting = (current, posts, count = COUNT) => {
  const local = posts.map(toEntry).filter(Boolean)
  const mine = new Set(local.map((w) => w.slug)) // a piece moved here from Substack is listed once, as the local one
  const all = [...local, ...elsewhere.filter((w) => !mine.has(w.slug))]
    .sort((a, b) => b.published.localeCompare(a.published))
  const at = all.findIndex((w) => w.local && w.slug === current.slug)
  const next = at < 0 ? all : [...all.slice(at + 1), ...all.slice(0, at)]
  return next.slice(0, count).map((w) => ({
    title: w.title,
    blurb: w.local ? w.subtitle : tidy(w.subtitle),
    href: w.local ? `../${w.slug}/` : w.url,
    external: !w.local,
  }))
}
