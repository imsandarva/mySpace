/* Small, pure text helpers shared by data derivations and views. */

/* Straight apostrophes inside words become typographic ones. */
export const curly = (s = '') => s.replace(/(\w)'(\w)/g, '$1’$2')

/* Editorial polish for copy that was typed casually: sentence case, curly apostrophes, no trailing full stop. */
export const tidy = (s = '') => {
  const t = curly(s.trim().replace(/\.$/, ''))
  return t.charAt(0).toUpperCase() + t.slice(1)
}

/* URL-safe identifier — "Shoe Dog" → "shoe-dog". */
export const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/* "Name: a long subtitle" → ['Name', 'a long subtitle']. */
export const splitTitle = (t) => { const i = t.indexOf(':'); return i > 0 ? [t.slice(0, i).trim(), t.slice(i + 1).trim()] : [t, ''] }

/* ['Life of an', 'idea'] — the last word travels with its trailing glyph so an arrow never wraps alone. */
export const splitLast = (s) => { const i = s.lastIndexOf(' '); return i < 0 ? ['', s] : [s.slice(0, i + 1), s.slice(i + 1)] }
