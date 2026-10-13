/* The shared canvas is not in document flow, so CSS overflow does not clip a book.
   Only ancestors marked `data-gl-clip` (the shelf rail) crop a book — clipping to every
   overflow:hidden on the page (html lock, the focus sheet) crops the open book on phones,
   so the nudge and the drag both land on empty space. Coordinates are relative to the canvas
   itself, which tracks the visual viewport; window.innerHeight does not. */

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
export function paintBox(el, canvas) {
  const r = el.getBoundingClientRect()
  const origin = canvas.getBoundingClientRect()
  let left = r.left, top = r.top, right = r.right, bottom = r.bottom
  if (right - left < 2 || bottom - top < 2) return null
  for (let n = el.parentElement; n; n = n.parentElement) {
    if (!n.hasAttribute('data-gl-clip')) continue
    const a = axes(n)
    if (!a.x && !a.y) continue
    const c = n.getBoundingClientRect()
    if (a.x) { left = Math.max(left, c.left + a.pl); right = Math.min(right, c.right - a.pr) }
    if (a.y) { top = Math.max(top, c.top + a.pt); bottom = Math.min(bottom, c.bottom - a.pb) }
  }
  left = Math.max(origin.left, left)
  top = Math.max(origin.top, top)
  right = Math.min(origin.right, right)
  bottom = Math.min(origin.bottom, bottom)
  if (right - left < 1 || bottom - top < 1) return null
  const box = { left: r.left - origin.left, top: r.top - origin.top, bottom: r.bottom - origin.top, width: r.width, height: r.height }
  return { box, left: left - origin.left, top: top - origin.top, bottom: bottom - origin.top, width: right - left, height: bottom - top }
}
