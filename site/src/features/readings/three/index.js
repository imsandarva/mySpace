import { applySurfaces } from './materials'
import { getEngine } from './engine'
import { cloneBook, cloneBookNow, loadModel } from './model'
import { peekSurfaces, surfacesFor, warmSurfaces } from './residency'
import { BookRig, REST } from './rig'

/* Public face of the 3D layer — the only module the rest of the app imports (lazily, so the page never waits for three.js).
   `createBookRig` builds one posed book: model clone + painted surfaces + studio, ready to register with the engine.
   Covers are cached (`residency`), so a second visit — the archive after the homepage — does not paint them again. */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const thickOf = (book) => book.shape.d / 13.25

function finishRig(engine, cloned, surfaces, opts) {
  const { renderer } = engine
  const { book, mode, rest, fill } = opts
  const { materials, dispose } = applySurfaces(cloned.parts, surfaces, book.shape.material, Math.min(8, renderer.capabilities.getMaxAnisotropy()))
  const rig = new BookRig({ renderer, holder: cloned.holder, parts: cloned.parts, materials, book, mode, rest, fill, snap: reduced() })
  rig.disposeSurfaces = dispose
  rig.onWake = engine.invalidate
  return rig
}

/* Null until the model and this tier's cover are already in memory. */
export function createBookRigNow({ book, tier = 'md', mode = 'rest', rest = REST, fill = 0.8 }) {
  const surfaces = peekSurfaces(book, tier)
  const cloned = cloneBookNow(thickOf(book))
  if (!surfaces || !cloned) return null
  return finishRig(getEngine(), cloned, surfaces, { book, mode, rest, fill })
}

export async function createBookRig({ book, tier = 'md', mode = 'rest', rest = REST, fill = 0.8 }) {
  const engine = getEngine()
  const thick = thickOf(book)
  const [{ holder, parts }, surfaces] = await Promise.all([cloneBook(thick), surfacesFor(book, tier, thick)])
  return finishRig(engine, { holder, parts }, surfaces, { book, mode, rest, fill })
}

/* Paint every archive cover ahead of the visit, two at a time. */
export const warmCollection = (books) => loadModel().then(() => warmSurfaces(books, 'sm'))

export { getEngine, REST }
