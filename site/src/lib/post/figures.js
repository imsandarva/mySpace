import { walk } from './walk.js'

/* The first figure in reading order. Link previews and the writings list both start here. */
export const firstFigure = (doc) => {
  let found = null
  walk(doc, (n) => { if (!found && n.type === 'figure' && n.attrs?.src) found = n.attrs })
  return found
}

/* Every image file a piece points at. Paths stay relative (`images/…`); the caller decides the folder. */
export const referencedImages = (post) => {
  const files = new Set()
  const add = (src) => { if (typeof src === 'string' && src.startsWith('images/')) files.add(src.split('?')[0]) }
  walk(post?.doc, (n) => {
    if (n.type !== 'figure') return
    add(n.attrs?.src)
    String(n.attrs?.srcset || '').split(',').forEach((part) => add(part.trim().split(/\s+/)[0]))
  })
  add(post?.preview?.src)
  return [...files]
}
