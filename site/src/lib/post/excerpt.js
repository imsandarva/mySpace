import { walk } from './walk.js'

/* Plain words from the body — share previews, editor settings, prerender meta. Not used for list blurbs. */
export const excerpt = (doc, max = 160) => {
  let text = ''
  walk(doc, (n) => {
    if (n.type === 'text') text += n.text || ''
    if (n.type === 'paragraph' || n.type === 'heading' || n.type === 'hardBreak') text += ' '
  })
  text = text.replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const at = cut.lastIndexOf(' ')
  return `${(at > 40 ? cut.slice(0, at) : cut).trim()}…`
}
