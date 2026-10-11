/* Resting shelf order. The first screen is hand-picked; everything after it keeps the original shelf order. */

const WRITING_LEAD = ['emergence-properties', 'by-endurance-we-conquer']
const READING_LEAD = ['Mans Search for Meaning', 'Sapiens', 'Zero to One', 'Steve Jobs', 'Surely You', 'The Alchemist', 'Atomic Habits', 'Siddhartha']

function plain(value) {
  return String(value).replace(/[\u2018\u2019\u02BC']/g, '')
}

function pull(list, leads, label) {
  const pool = list.slice()
  const picked = []
  leads.forEach((lead) => {
    const want = plain(lead)
    const index = pool.findIndex((item) => plain(label(item)).startsWith(want))
    if (index >= 0) picked.push(pool.splice(index, 1)[0])
  })
  return [...picked, ...pool]
}

export function arrangeWritings(list) {
  return pull(list, WRITING_LEAD, (piece) => piece.slug)
}

/* The live book always leads. It is a status, not a pick. */
export function arrangeBooks(list) {
  const current = list.find((book) => book.current) ?? null
  const rest = pull(current ? list.filter((book) => book !== current) : list, READING_LEAD, (book) => book.title)
  return { ordered: current ? [current, ...rest] : rest, total: list.length }
}
