import { frameDistance, buildStudio } from './studio'
import { samplePosePath } from './poseScript'

/* One book, posed and animated. A "view" for the engine: it knows its element, its scene and camera, how to settle toward
   a target pose each frame, and when it has stopped moving (so the engine can sleep). Nothing here is idle motion:
   a book only moves in response to hover, selection, the visitor's drag, or a transition. */

const REST = { yaw: 0.42, pitch: 0.19 }
const MAX_PITCH = 1.45
const DRAG = 0.0105 /* radians per pixel */
const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt))
const settled = (a, b) => Math.abs(a - b) < 0.0008

export class BookRig {
  visible = true
  hidden = false
  hover = false
  fadeTo = 1
  fade = 1
  hoverAmt = 0
  snap = false

  constructor({ renderer, holder, parts, materials, book, mode, rest = REST, fill = 0.8, snap = false }) {
    const { scene, ground, camera, shadow, veil } = buildStudio(renderer)
    this.scene = scene; this.camera = camera; this.shadow = shadow; this.veil = veil
    this.scenes = [ground, scene] /* drawn in order, sharing one camera */
    this.holder = holder; this.materials = materials; this.book = book
    this.mode = mode; this.fill = fill; this.snap = snap; this.front = mode === 'focus'
    this.yaw = this.yawTo = rest.yaw
    this.pitch = this.pitchTo = rest.pitch
    this.rest = rest
    scene.add(holder)
    this.pose()
  }

  /* --- controls --- */

  setHover(on) { this.hover = on; this.wake() }
  setRest(rest) { this.rest = rest; this.yawTo = rest.yaw; this.pitchTo = rest.pitch; this.wake() }
  setFill(fill) { this.fill = fill; this.wake() }

  /* Fade out/in. `instant` skips the animation (used when a book hands over to its focused twin). */
  setFade(to, instant = false) {
    this.fadeTo = to
    if (instant) { this.fade = to; this.apply() }
    this.refresh()
    this.wake()
  }

  /* Hidden views are skipped by the engine entirely, so visibility must be recomputed whenever a target changes. */
  refresh() { this.visible = !this.hidden && (this.fade > 0 || this.fadeTo > 0) }

  /* Direct manipulation: dragging turns the book about its own vertical axis (yaw) and tilts it toward/away from you (pitch).
     Pitch is capped just short of vertical so the controls never flip; the top and bottom edges are both reachable. */
  rotateBy(dx, dy) {
    this.cancelPoseScript()
    this.yawTo += dx * DRAG
    this.pitchTo = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, this.pitchTo + dy * DRAG))
    this.wake()
  }

  nudge(dyaw, dpitch) { this.rotateBy(dyaw / DRAG, dpitch / DRAG) }

  /* Choreographed targets (opening dance, etc.): smooth path drives yawTo/pitchTo each frame; visitor drag cancels. */
  beginPoseScript(keyframes, durationMs) {
    this.cancelPoseScript()
    this.poseScript = { keyframes, duration: durationMs, t0: performance.now(), baseYaw: this.yawTo, basePitch: this.pitchTo }
    this.wake()
  }

  cancelPoseScript() { this.poseScript = null }

  _advancePoseScript() {
    const s = this.poseScript
    if (!s) return false
    const u = Math.min(1, (performance.now() - s.t0) / s.duration)
    const { dy, dp } = samplePosePath(s.keyframes, u)
    this.yawTo = s.baseYaw + dy
    this.pitchTo = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, s.basePitch + dp))
    if (u >= 1) this.poseScript = null
    return !!this.poseScript
  }

  /* Back to the three-quarter view, by the shortest way round. */
  reset() {
    const turns = Math.round((this.yawTo - this.rest.yaw) / (2 * Math.PI))
    this.yawTo = this.rest.yaw + turns * 2 * Math.PI
    this.pitchTo = this.rest.pitch
    this.wake()
  }

  get orientation() { return { yaw: this.yaw, pitch: this.pitch } }

  /* --- per-frame --- */

  wake() { this.onWake?.() }

  /* Settle toward the target; returns true while anything is still moving. */
  tick(dt) {
    const scripting = this._advancePoseScript()
    const k = this.snap ? 999 : 1
    this.yaw = damp(this.yaw, this.yawTo, 16 * k, dt)
    this.pitch = damp(this.pitch, this.pitchTo, 16 * k, dt)
    this.hoverAmt = damp(this.hoverAmt, this.hover ? 1 : 0, 14 * k, dt)
    this.fade = damp(this.fade, this.fadeTo, 11 * k, dt)
    if (this.fadeTo === 0 && this.fade < 0.02) this.fade = 0
    if (this.fadeTo === 1 && this.fade > 0.98) this.fade = 1
    this.apply()
    this.refresh()
    return scripting || !(settled(this.yaw, this.yawTo) && settled(this.pitch, this.pitchTo) && settled(this.hoverAmt, this.hover ? 1 : 0) && settled(this.fade, this.fadeTo))
  }

  /* Hover lifts the book slightly, brings it forward and turns it a touch toward you; its shadow tightens. */
  pose() {
    const h = this.hoverAmt
    this.holder.rotation.set(this.pitch, this.yaw - 0.13 * h, 0, 'XYZ')
    this.holder.position.set(0, 0.03 * h, 0.2 * h)
    /* The shadow belongs to the ground under the book's resting contact point; it does not follow the book as it is turned. */
    const rp = this.rest.pitch
    this.shadow.position.set(0.03, -0.5 * Math.cos(rp) + 0.012 - 0.02 * h, -0.5 * Math.sin(rp))
    this.shadow.scale.set(1 - 0.1 * h, 1 - 0.1 * h, 1)
  }

  apply() {
    this.pose()
    this.shadow.material.opacity = 0.92 - 0.32 * this.hoverAmt
    this.veil.material.uniforms.uAlpha.value = 1 - this.fade
    this.veil.visible = this.fade < 1
  }

  /* The page colour behind this view (a CSS colour), so a fade dissolves into it. */
  setVeilColor(css) { this.veil.material.uniforms.uColor.value.set(css) }

  /* Camera framing: rest views fit the book itself; the focus view leaves room for the whole turning sphere. */
  frame(aspect) {
    const [halfH, halfW] = this.mode === 'focus' ? [0.63, 0.63] : [0.5 / this.fill, 0.42]
    this.camera.aspect = aspect
    /* Camera sits a touch low, so the book rides high in its box and its shadow has room beneath — never clipped by the view's edge. */
    this.camera.position.set(0, -0.07, frameDistance(halfH, halfW, aspect))
    this.camera.updateProjectionMatrix()
  }

  dispose() {
    this.scene.remove(this.holder)
    this.materials.forEach((m) => m.dispose?.())
    this.shadow.geometry.dispose()
    this.shadow.material.dispose()
    this.veil.geometry.dispose()
    this.veil.material.dispose()
    this.disposeSurfaces?.()
  }
}

export { REST }
