/* How much of each shelf the front door shows before "All". */
export const WRITING_PREVIEW = 2
export const READING_PREVIEW = 2

/* Currently-reading stays first. The rest keep shelf order. No dates, so no year groups. */
export function arrangeBooks(list) {
  const current = list.find((book) => book.current) ?? null
  const rest = current ? list.filter((book) => book !== current) : list.slice()
  return { current, rest, total: list.length }
}
