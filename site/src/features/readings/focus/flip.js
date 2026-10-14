/* FLIP: move an element from where it *was* to where it *is*, as one smooth motion.
   Layout has already changed; we start from the old rectangle's transform and animate to none (or the reverse). */

/* Spatial flight, not the snappy UI ease. That curve is ~90% done by 40% of the time, so a book
   that mostly scales (the first one, already on the left) appears to pop to full size. */
export const EASE = 'cubic-bezier(0.22, 0.5, 0.2, 1)'

const centre = (r) => [r.left + r.width / 2, r.top + r.height / 2]

/* Layout size (stable) + viewport position — avoids a bad first-paint rect before the focus stage has settled. */
export function layoutRect(el) {
  const r = el.getBoundingClientRect()
  const w = el.offsetWidth, h = el.offsetHeight
  return { left: r.left, top: r.top, width: w, height: h, right: r.left + w, bottom: r.top + h }
}

/* The transform that makes `el` (laid out at `to`) look like it is sitting at `from`. */
export function invert(from, to) {
  const [fx, fy] = centre(from)
  const [tx, ty] = centre(to)
  return `translate(${fx - tx}px, ${fy - ty}px) scale(${from.width / to.width}, ${from.height / to.height})`
}

export function homeTransform(shelfEl, focusEl) {
  const from = shelfEl && layoutRect(shelfEl)
  const to = focusEl && layoutRect(focusEl)
  return from && to ? invert(from, to) : null
}

/* Animate `el` between two transforms; resolves when finished. Skipped (resolves at once) when motion is reduced. */
export function glide(el, fromT, toT, duration, reduced) {
  if (reduced) { el.style.transform = toT; return Promise.resolve() }
  const a = el.animate([{ transform: fromT }, { transform: toT }], { duration, easing: EASE, fill: 'both' })
  return a.finished.then(() => { el.style.transform = toT; a.cancel() }).catch(() => {})
}

export const inViewport = (r) => r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth
