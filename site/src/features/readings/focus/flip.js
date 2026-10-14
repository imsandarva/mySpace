/* FLIP for a book that is drawn into a box, not for the box itself.
   The open stage is nearly square and frames the book loosely (room to turn); a shelf slot is portrait and frames it tight.
   Scaling one box onto the other therefore lands the book small, and the shelf then appears to reload when the real one
   takes over. The flight scales uniformly — aspect, and so the framing, stays put — until the *book* matches the shelf. */

import { bookFootprint } from '../three/framing'

/* Spatial flight, not the snappy UI ease. That curve is ~90% done by 40% of the time, so a book
   that mostly scales (the first one, already on the left) appears to pop to full size. */
export const EASE = 'cubic-bezier(0.22, 0.5, 0.2, 1)'

/* Layout size (stable) + viewport position — avoids a bad first-paint rect before the focus stage has settled. */
export function layoutRect(el) {
  const r = el.getBoundingClientRect()
  const w = el.offsetWidth, h = el.offsetHeight
  return { left: r.left, top: r.top, width: w, height: h, right: r.left + w, bottom: r.top + h }
}

/* Transform (origin centre) that makes the book drawn in `stageEl` sit exactly where the shelf book sits.
   `stageEl` must be untransformed when measured. The rig stays in focus framing for the whole flight. */
export function flightTransform(stageEl, slotEl, fill) {
  if (!stageEl || !slotEl || !fill) return null
  const stage = layoutRect(stageEl)
  const slot = layoutRect(slotEl)
  if (stage.width < 2 || stage.height < 2 || slot.width < 2 || slot.height < 2) return null
  const focus = bookFootprint('focus', fill, stage.width / stage.height)
  const rest = bookFootprint('rest', fill, slot.width / slot.height)
  const s = (slot.height * rest.h) / (stage.height * focus.h)
  const tx = (slot.left + slot.width / 2) - (stage.left + stage.width / 2)
  const ty = (slot.top + slot.height * rest.cy) - (stage.top + stage.height / 2) - stage.height * (focus.cy - 0.5) * s
  return `translate(${tx}px, ${ty}px) scale(${s})`
}

/* Animate `el` between two transforms; resolves when finished. Skipped (resolves at once) when motion is reduced. */
export function glide(el, fromT, toT, duration, reduced) {
  if (reduced) { el.style.transform = toT; return Promise.resolve() }
  const a = el.animate([{ transform: fromT }, { transform: toT }], { duration, easing: EASE, fill: 'both' })
  return a.finished.then(() => { el.style.transform = toT; a.cancel() }).catch(() => {})
}

export const inViewport = (r) => r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth
