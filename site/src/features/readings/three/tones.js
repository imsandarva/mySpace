/* Cover tones live once, in CSS (styles/tokens.css, [data-tone]). The 3D layer reads them from there,
   so a colour changed in the stylesheet changes the CSS fallback book and the 3D book together. */
const cache = new Map()

export function toneOf(name) {
  if (cache.has(name)) return cache.get(name)
  const probe = document.createElement('i')
  probe.dataset.tone = name
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const css = getComputedStyle(probe)
  const tone = { bg: css.getPropertyValue('--tone').trim() || '#3a3f55', on: css.getPropertyValue('--tone-on').trim() || '#f3efe6' }
  probe.remove()
  cache.set(name, tone)
  return tone
}

/* Relative luminance of a #rrggbb colour (0 dark … 1 light) — decides how lettering sits in the material. */
export function luminance(hex) {
  const n = parseInt(hex.replace('#', '').padEnd(6, '0').slice(0, 6), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
