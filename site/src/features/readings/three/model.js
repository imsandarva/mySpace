import { Group } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

/* The one reusable hardcover (assets/hardcover.glb): meshes Front, Back, Spine, Pages; 15.7 × 23 × 3 cm; centred pivot;
   front faces +z, spine on the left. Loaded once, then cloned per book (clones share the tiny geometry). */

const URL = `${import.meta.env.BASE_URL}assets/hardcover.glb`
export const BOOK = { width: 0.157, height: 0.23, depth: 0.0304 }

let template

export const loadModel = () => (template ??= new GLTFLoader().loadAsync(URL).then((gltf) => gltf.scene))

/* A fresh, unit-height copy of the book. `thick` stretches only the thickness, so books differ in heft, not in cover proportions. */
export async function cloneBook(thick = 1) {
  const scene = await loadModel()
  const model = scene.clone(true)
  const s = 1 / BOOK.height
  model.scale.set(s, s, s * thick)
  const holder = new Group()
  holder.add(model)
  const parts = {}
  model.traverse((o) => { if (o.isMesh) parts[o.name] = o })
  return { holder, parts }
}
