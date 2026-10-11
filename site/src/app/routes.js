import { bookBySlug } from '../lib/books'

/* Route table — one place that knows every URL the site answers to. Hash-based, so static hosting just works.
   `section` is the header item a page belongs to; `title` is a string or a function of the route params. */

const table = [
  { name: 'writings', re: /^writings\/?$/, title: 'Writings' },
  { name: 'book', section: 'readings', re: /^readings\/([a-z0-9-]+)\/?$/, keys: ['slug'], title: ({ slug }) => bookBySlug(slug)?.name ?? 'Readings' },
  { name: 'readings', re: /^readings\/?$/, title: 'Readings' },
  { name: 'pin', re: /^pin(?:\/(profile|board))?\/?$/, keys: ['view'] },
]

export const SITE = 'Sandarva'

const build = (r, path = '', match = []) => {
  const params = Object.fromEntries((r?.keys ?? []).map((k, i) => [k, match[i + 1]]))
  const name = r?.name ?? 'home'
  return { name, section: r?.section ?? name, key: path || 'home', params, title: r?.title }
}

/* '#/readings/shoe-dog' → { name: 'book', section: 'readings', params: { slug: 'shoe-dog' } }. Unknown paths fall back to home. */
export function matchRoute(path) {
  for (const r of table) {
    const m = path.match(r.re)
    if (m) return build(r, path, m)
  }
  return build(null)
}

export const routeTitle = ({ title, params }) => {
  const t = typeof title === 'function' ? title(params) : title
  return t ? `${t} — ${SITE}` : SITE
}
