import { CanvasTexture, Color, LinearMipmapLinearFilter, SRGBColorSpace } from 'three'

/* Surface response per cover material: cloth and matte paper are rough; smooth board carries a faint sheen. */
const ROUGHNESS = { cloth: 0.92, matte: 0.88, board: 0.56 }

function textureOf(canvas, anisotropy) {
  const t = new CanvasTexture(canvas)
  t.colorSpace = SRGBColorSpace
  t.flipY = false /* glTF UVs start at the top-left, like a canvas */
  t.minFilter = LinearMipmapLinearFilter
  t.anisotropy = anisotropy
  return t
}

/* Give a cloned book its own materials: artwork on Front and Spine, a plain colour on Back, the page block left ivory.
   Returns a dispose function for everything it created. */
export function applySurfaces(parts, surfaces, kind, anisotropy) {
  const own = []
  const make = (mesh, patch) => {
    const m = mesh.material.clone()
    Object.assign(m, patch)
    mesh.material = m
    own.push(m)
    return m
  }
  const front = textureOf(surfaces.front, anisotropy)
  const spine = textureOf(surfaces.spine, anisotropy)
  const roughness = ROUGHNESS[kind] ?? 0.85
  make(parts.Front, { map: front, color: new Color(0xffffff), roughness })
  make(parts.Spine, { map: spine, color: new Color(0xffffff), roughness })
  make(parts.Back, { color: new Color(surfaces.back), roughness })
  make(parts.Pages, { color: new Color(0.78, 0.71, 0.6) }) /* ivory, dimmed a touch so the top edge never blows out to white */
  return { materials: own, dispose: () => { front.dispose(); spine.dispose(); own.forEach((m) => m.dispose()) } }
}
