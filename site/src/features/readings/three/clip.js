/* The shared canvas is not in document flow, so CSS overflow does not clip a book.
   Scissor to the intersection of the element's box, every overflow ancestor, and the viewport —
   the book slides out of a rail instead of painting over whatever sits beside it. */

const CLIP = /auto|scroll|hidden|clip/
const meta = new WeakMap()
let gen = 0

export const bumpClipCache = () => { gen += 1 }

function axes(el) {
  let m = meta.get(el)
  if (m?.gen === gen) return m
  const s = getComputedStyle(el)
  m = {
    gen,
    x: CLIP.test(s.overflowX),
    y: CLIP.test(s.overflowY),
    pl: parseFloat(s.paddingLeft) || 0,
    pr: parseFloat(s.paddingRight) || 0,
    pt: parseFloat(s.paddingTop) || 0,
    pb: parseFloat(s.paddingBottom) || 0,
  }
  meta.set(el, m)
  return m
}

/* `el` is the full slot (viewport stays this size so the book doesn't squash). `scissor` is the visible piece. Null when nothing shows. */
export function paintBox(el) {
  const r = el.getBoundingClientRect()
  let left = r.left, top = r.top, right = r.right, bottom = r.bottom
  if (right - left < 2 || bottom - top < 2) return null
  for (let n = el.parentElement; n; n = n.parentElement) {
    const a = axes(n)
    if (!a.x && !a.y) continue
    const c = n.getBoundingClientRect()
    if (a.x) { left = Math.max(left, c.left + a.pl); right = Math.min(right, c.right - a.pr) }
    if (a.y) { top = Math.max(top, c.top + a.pt); bottom = Math.min(bottom, c.bottom - a.pb) }
  }
  left = Math.max(0, left)
  top = Math.max(0, top)
  right = Math.min(window.innerWidth, right)
  bottom = Math.min(window.innerHeight, bottom)
  if (right - left < 1 || bottom - top < 1) return null
  return { box: r, left, top, bottom, width: right - left, height: bottom - top }
}
