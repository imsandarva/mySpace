import { openedSlug } from '../lib/openedBook'

/* Keep the opened book in view after returning to a list (page or shelf rail), so the morph lands on screen. */
function centreOpened() {
  const el = document.getElementById(`anchor-${openedSlug()}`)
  if (!el) return
  if (el.closest('.rail-track')) return el.scrollIntoView({ block: 'nearest', inline: 'center' })
  const r = el.getBoundingClientRect()
  if (r.top < 0 || r.bottom > window.innerHeight) el.scrollIntoView({ block: 'center' })
}

/* Scroll policy for a route change:
   a book page always starts at the top; a list you come back to resumes where you left it (and shows the book you opened);
   everything else starts at the top. `saved` holds positions recorded on the way out. */
export function applyScroll(route, from, saved) {
  const y = route.name === 'book' ? 0 : saved.get(route.key) ?? 0
  if (route.name !== 'home') saved.delete(route.key)
  window.scrollTo(0, y)
  if (from?.name === 'book' && route.name !== 'book') centreOpened()
}

/* Which positions are worth remembering when leaving `from` for `next`: home always, any list when opening a book. */
export const shouldSave = (from, next) => from.name === 'home' || next.name === 'book'
