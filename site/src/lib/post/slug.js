import { slugify } from '../text.js'

/* A slug is born from the title once, then frozen. Editing the title later must not break a link already shared. */

export const allocateSlug = (title, taken) => {
  const base = (slugify(title) || 'note').slice(0, 72).replace(/-$/g, '') || 'note'
  if (!taken.has(base)) return base
  let i = 2
  while (taken.has(`${base}-${i}`)) i += 1
  return `${base}-${i}`
}
