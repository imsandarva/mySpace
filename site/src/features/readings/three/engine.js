import { NoToneMapping, SRGBColorSpace, Vector2, WebGLRenderer } from 'three'

/* One WebGL canvas for the whole site, drawn into many DOM-tracked rectangles ("views").
   Each view is an element on the page plus a scene; the engine renders a view only while its element is on screen,
   and only while something is changing (a pose settling, a transition, a scroll). When everything is still, it sleeps. */

const MAX_DPR = 2

class Engine {
  views = new Set()
  raf = 0
  until = 0
  last = 0
  size = new Vector2()

  constructor() {
    const canvas = document.createElement('canvas')
    canvas.className = 'gl-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    document.body.appendChild(canvas)
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.toneMapping = NoToneMapping
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.autoClear = false /* we clear once per frame, so neighbouring views never erase each other */
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR))
    window.addEventListener('scroll', this.invalidate, { passive: true })
    window.addEventListener('resize', this.invalidate, { passive: true })
    document.addEventListener('visibilitychange', this.invalidate)
    if (import.meta.env.DEV) window.__books = this /* dev-only inspection handle */
  }

  /* Register a view: { el, scenes[], camera, visible, tick(dt) → still-moving?, frame(aspect) }. Returns the unregister function. */
  add(view) {
    this.views.add(view)
    this.invalidate()
    return () => { this.views.delete(view); this.invalidate() }
  }

  /* Ask for one more frame (coalesced). */
  invalidate = () => { if (!this.raf && !document.hidden) this.raf = requestAnimationFrame(this.frame) }

  /* Keep rendering for `ms` — covers DOM animations the engine can't see (FLIP moves, CSS transitions). */
  invalidateFor(ms) { this.until = Math.max(this.until, performance.now() + ms); this.invalidate() }

  syncSize() {
    const { clientWidth: w, clientHeight: h } = this.renderer.domElement
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    if (dpr !== this.renderer.getPixelRatio()) this.renderer.setPixelRatio(dpr)
    const size = this.renderer.getSize(this.size)
    if (size.x !== w || size.y !== h) this.renderer.setSize(w, h, false)
    return h
  }

  frame = (now) => {
    this.raf = 0
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 1 / 60
    this.last = now
    const { renderer } = this
    const canvasH = this.syncSize()
    const vw = window.innerWidth
    let busy = now < this.until

    renderer.setScissorTest(false)
    renderer.clear(true, true, true)
    renderer.setScissorTest(true)

    for (const view of this.views) {
      if (!view.visible) continue
      const r = view.el.getBoundingClientRect()
      if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > canvasH || r.right < 0 || r.left > vw) continue
      if (view.tick(dt)) busy = true
      if (!view.visible) continue
      view.frame(r.width / r.height)
      renderer.setViewport(r.left, canvasH - r.bottom, r.width, r.height)
      renderer.setScissor(r.left, canvasH - r.bottom, r.width, r.height)
      for (const scene of view.scenes) { renderer.clearDepth(); renderer.render(scene, view.camera) }
    }

    if (busy) this.invalidate()
    else this.last = 0
  }
}

let instance = null

/* The shared engine, created on first use. */
export const getEngine = () => (instance ??= new Engine())
