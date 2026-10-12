/* Route table — one place that knows every URL the site answers to. Hash-based, so static hosting just works.
   `section` is the header item a page belongs to. A book is never a route: opening one is a state of the page it is on. */

const table = [
  { name: 'writings', re: /^writings\/?$/, title: 'Writings' },
  { name: 'readings', re: /^readings(?:\/[a-z0-9-]*)?\/?$/, title: 'Readings' },
  { name: 'pin', re: /^pin(?:\/(profile|board))?\/?$/, keys: ['view'] },
]

export const SITE = 'Sandarva'

const build = (r, path = '', match = []) => {
  const params = Object.fromEntries((r?.keys ?? []).map((k, i) => [k, match[i + 1]]))
  const name = r?.name ?? 'home'
  return { name, section: r?.section ?? name, key: path || 'home', params, title: r?.title }
}

/* '#/readings' → { name: 'readings' }. Unknown paths fall back to home. */
export function matchRoute(path) {
  for (const r of table) {
    const m = path.match(r.re)
    if (m) return build(r, path, m)
  }
  return build(null)
}

export const routeTitle = ({ title }) => (title ? `${title} — ${SITE}` : SITE)
