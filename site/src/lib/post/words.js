import { walk } from './walk.js'

/* Words in the body. The title, subtitle, and image captions are not part of the count. */
export const wordsIn = (doc) => {
  let text = ''
  walk(doc, (n) => { if (n.type === 'text' && n.text) text += ` ${n.text}` })
  return text.trim() ? text.trim().split(/\s+/).length : 0
}
