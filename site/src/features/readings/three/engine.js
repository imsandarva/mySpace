import { NoToneMapping, SRGBColorSpace, Vector2, WebGLRenderer } from 'three'
import { bumpClipCache, paintBox } from './clip'

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
    /* Capture: scroll does not bubble, so a rail (overflow scroller) would otherwise leave the canvas behind. */
    document.addEventListener('scroll', this.invalidate, { capture: true, passive: true })
    window.addEventListener('resize', this.onResize, { passive: true })
    document.addEventListener('visibilitychange', this.invalidate)
    window.visualViewport?.addEventListener('resize', this.invalidate, { passive: true })
    window.visualViewport?.addEventListener('scroll', this.invalidate, { passive: true })
    if (import.meta.env.DEV) window.__books = this /* dev-only inspection handle */
  }

  soon = false

  /* Register a view: { el, scenes[], camera, visible, tick(dt) → still-moving?, frame(aspect) }. Returns the unregister function. */
  add(view) {
    this.views.add(view)
    this.drawSoon()
    return () => { this.views.delete(view); this.drawSoon() }
  }

  /* Draw before the browser paints — a view transition would otherwise snapshot an empty canvas, then the books "refresh" in. */
  drawSoon() {
    if (this.soon) return
    this.soon = true
    queueMicrotask(() => {
      this.soon = false
      if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0 }
      this.frame(performance.now())
    })
  }

  /* Ask for one more frame (coalesced). */
  invalidate = () => { if (!this.raf && !document.hidden) this.raf = requestAnimationFrame(this.frame) }

  onResize = () => { bumpClipCache(); this.invalidate() }

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
    let busy = now < this.until

    renderer.setScissorTest(false)
    renderer.clear(true, true, true)
    renderer.setScissorTest(true)

    for (const view of this.views) {
      if (!view.visible) continue
      /* Settle even while off-screen, so a book is already opaque the moment it scrolls into view. */
      if (view.tick(dt)) busy = true
      if (!view.visible) continue
      const paint = paintBox(view.el, renderer.domElement)
      if (!paint) continue
      const { box } = paint
      view.frame(box.width / box.height)
      renderer.setViewport(box.left, canvasH - box.bottom, box.width, box.height)
      renderer.setScissor(paint.left, canvasH - paint.bottom, paint.width, paint.height)
      for (const scene of view.scenes) { renderer.clearDepth(); renderer.render(scene, view.camera) }
    }

    if (busy) this.invalidate()
    else this.last = 0
  }
}

let instance = null

/* The shared engine, created on first use. */
export const getEngine = () => (instance ??= new Engine())
