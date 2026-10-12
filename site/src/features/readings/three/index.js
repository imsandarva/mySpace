import { applySurfaces } from './materials'
import { paintBook } from './covers'
import { getEngine } from './engine'
import { cloneBook } from './model'
import { BookRig, REST } from './rig'

/* Public face of the 3D layer — the only module the rest of the app imports (lazily, so the page never waits for three.js).
   `createBookRig` builds one posed book: model clone + painted surfaces + studio, ready to register with the engine. */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export async function createBookRig({ book, tier = 'md', mode = 'rest', rest = REST, fill = 0.8 }) {
  const engine = getEngine()
  const { renderer } = engine
  const thick = book.shape.d / 13.25
  const [{ holder, parts }, surfaces] = await Promise.all([cloneBook(thick), paintBook(book, tier, thick)])
  const { materials, dispose } = applySurfaces(parts, surfaces, book.shape.material, Math.min(8, renderer.capabilities.getMaxAnisotropy()))
  const rig = new BookRig({ renderer, holder, parts, materials, book, mode, rest, fill, snap: reduced() })
  rig.disposeSurfaces = dispose
  rig.onWake = engine.invalidate
  return rig
}

export { getEngine, REST }
