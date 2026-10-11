/* Which book the visitor last opened, and the one element carrying its shared-element name.
   Only one book is ever named at a time, so the browser carries exactly that book between pages (names must be unique). */

let opened = null
let named = null

export const openedSlug = () => opened
export const bookName = (slug) => `book-${slug}`

/* Name to render with: the opened book keeps its identity across the list ↔ detail transition. */
export const nameIf = (slug) => (slug === opened ? bookName(slug) : undefined)

/* Call on click, before navigation: remember the book and name its element so the "before" snapshot has it. */
export function openBook(slug, el) {
  opened = slug
  if (named && named !== el) named.style.viewTransitionName = ''
  if (el) el.style.viewTransitionName = bookName(slug)
  named = el
}
