/* Route table — one place that knows every URL the site answers to. Hash-based, so static hosting just works. */

const table = [
  { name: 'writings', re: /^writings\/?$/, title: 'Writings' },
  { name: 'readings', re: /^readings(?:\/([a-z0-9-]+))?\/?$/, keys: ['slug'], title: 'Readings' },
  { name: 'pin', re: /^pin(?:\/(profile|board))?\/?$/, keys: ['view'] },
]

export const SITE = 'Sandarva'

const build = (name, path = '', keys = [], match = []) => ({
  name,
  key: path || 'home',
  params: Object.fromEntries(keys.map((k, i) => [k, match[i + 1]])),
})

/* '#/readings/shoe-dog' → { name: 'readings', params: { slug: 'shoe-dog' } }. Unknown paths fall back to home. */
export function matchRoute(path) {
  for (const r of table) {
    const m = path.match(r.re)
    if (m) return build(r.name, path, r.keys, m)
  }
  return build('home')
}

export const routeTitle = (name) => {
  const t = table.find((r) => r.name === name)?.title
  return t ? `${t} — ${SITE}` : SITE
}
