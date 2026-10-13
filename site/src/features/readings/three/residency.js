import { paintBook } from './covers'

/* Painted covers stay in memory after a rig is disposed, so opening the archive does not paint every book again. */

const cache = new Map()
const pending = new Map()
const keyOf = (book, tier) => `${book.slug}:${tier}`

export const peekSurfaces = (book, tier) => cache.get(keyOf(book, tier)) ?? null

export function surfacesFor(book, tier, thick) {
  const key = keyOf(book, tier)
  if (cache.has(key)) return Promise.resolve(cache.get(key))
  if (pending.has(key)) return pending.get(key)
  const job = paintBook(book, tier, thick).then((surfaces) => { cache.set(key, surfaces); pending.delete(key); return surfaces })
  pending.set(key, job)
  return job
}

/* Two at a time, in shelf order, so the top of the archive is ready first and the main thread can still breathe. */
export function warmSurfaces(books, tier = 'sm') {
  let index = 0
  const worker = async () => {
    while (index < books.length) {
      const book = books[index++]
      await surfacesFor(book, tier, book.shape.d / 13.25)
    }
  }
  return Promise.all([worker(), worker()])
}
