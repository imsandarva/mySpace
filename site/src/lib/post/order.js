/* Reader-facing collection order: newest publication day first, then slug for a stable tie. */

export const byPublishedDesc = (a, b) =>
  (b.published || '').localeCompare(a.published || '') || (a.slug || '').localeCompare(b.slug || '')

export const sortByPublishedDesc = (items) => [...items].sort(byPublishedDesc)
