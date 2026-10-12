import { Color, DataTexture, DirectionalLight, LinearFilter, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, PMREMGenerator, RGBAFormat, Scene, ShaderMaterial, SRGBColorSpace } from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

/* The shared studio: soft image-based light (a procedural room — nothing to download), one gentle key light,
   a fixed three-quarter camera with restrained perspective, and a soft contact shadow under every book. */

export const FOV = 24
const TAN = Math.tan((FOV / 2) * (Math.PI / 180))

let env
/* Soft, diffuse environment for every book — built once from the shared renderer. */
export function studioEnvironment(renderer) {
  if (env) return env
  const pmrem = new PMREMGenerator(renderer)
  env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
  return env
}

let shadowMap
/* A soft ellipse: a tight dark core inside a wide, faint falloff — the look of a book resting on paper.
   Built from raw RGBA (constant ink colour, computed alpha) so there is no colour noise at low opacity. */
function shadowTexture() {
  if (shadowMap) return shadowMap
  const [W, H] = [256, 96]
  const data = new Uint8Array(W * H * 4)
  const blob = (x, y, rx, ry, a) => { const d = Math.hypot((x - W / 2) / rx, (y - H / 2) / ry); return d >= 1 ? 0 : a * (1 - d) ** 2 }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const a = Math.min(1, blob(x, y, 126, 46, 0.22) + blob(x, y, 92, 24, 0.5))
      data.set([18, 22, 43, Math.round(a * 255)], (y * W + x) * 4)
    }
  }
  shadowMap = new DataTexture(data, W, H, RGBAFormat)
  shadowMap.colorSpace = SRGBColorSpace
  shadowMap.minFilter = shadowMap.magFilter = LinearFilter
  shadowMap.generateMipmaps = false
  shadowMap.needsUpdate = true
  return shadowMap
}

/* A view's scene: environment light, key light, and the shadow sprite. Returns the pieces the rig animates. */
export function buildStudio(renderer) {
  const scene = new Scene()
  scene.environment = studioEnvironment(renderer)
  scene.environmentIntensity = 0.85
  const key = new DirectionalLight(0xffffff, 1.15)
  key.position.set(-1.4, 2.2, 3)
  scene.add(key)
  /* The shadow lives in its own scene, drawn first: transparent objects are otherwise sorted after opaque ones,
     which would lay the shadow over the book instead of under it. */
  const ground = new Scene()
  const shadow = new Mesh(new PlaneGeometry(0.9, 0.34), new MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false, depthTest: false }))
  ground.add(shadow)
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 20)
  const veil = buildVeil()
  scene.add(veil)
  return { scene, ground, camera, shadow, veil }
}

/* Camera distance that frames a half-height × half-width box (in book-height units) inside a view of the given aspect. */
export const frameDistance = (halfH, halfW, aspect) => Math.max(halfH / TAN, halfW / (TAN * aspect))

/* A full-view quad in the page's own colour, drawn last. Fading a book is raising the veil — the book stays solid (no see-through
   boards, no glassy pages) and simply dissolves into the paper, exactly like an opacity fade of a flat image. */
function buildVeil() {
  const veil = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({
    uniforms: { uColor: { value: new Color(0xf0ebe1) }, uAlpha: { value: 0 } },
    vertexShader: 'void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: 'uniform vec3 uColor; uniform float uAlpha;\nvoid main() {\n  gl_FragColor = vec4(uColor, uAlpha);\n#include <colorspace_fragment>\n}',
    transparent: true, depthTest: false, depthWrite: false,
  }))
  veil.frustumCulled = false
  veil.renderOrder = 10
  veil.visible = false
  return veil
}
