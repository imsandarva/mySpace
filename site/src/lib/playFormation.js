import { buildFragments, easeOut, formedRect, fragmentCounts, toneCanvas } from './fragments'

const FORM_MS = 2100

function destVerts(verts, imgW, imgH, rect) {
  return verts.map((v) => ({
    x: rect.x + (v.x / imgW) * rect.w,
    y: rect.y + (v.y / imgH) * rect.h,
  }))
}

function paint(ctx, cells, muted, final, imgW, imgH, rect, t, vw, vh) {
  ctx.fillStyle = '#faf7f2'
  ctx.fillRect(0, 0, vw, vh)
  for (const cell of cells) {
    const p = easeOut((t - cell.delay) / (1 - cell.delay), cell.power)
    if (p <= 0) continue
    const ox = cell.sx * (1 - p)
    const oy = cell.sy * (1 - p)
    const verts = destVerts(cell.verts, imgW, imgH, rect)
    ctx.save()
    ctx.translate(ox, oy)
    ctx.translate(rect.x + rect.w / 2, rect.y + rect.h / 2)
    ctx.rotate(cell.rot * (1 - p))
    ctx.translate(-(rect.x + rect.w / 2), -(rect.y + rect.h / 2))
    ctx.beginPath()
    ctx.moveTo(verts[0].x, verts[0].y)
    for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i].x, verts[i].y)
    ctx.closePath()
    ctx.clip()
    ctx.globalAlpha = 0.38 + 0.62 * p
    ctx.drawImage(muted, rect.x, rect.y, rect.w, rect.h)
    ctx.globalAlpha = p
    ctx.drawImage(final, rect.x, rect.y, rect.w, rect.h)
    ctx.restore()
  }
}

/* Canvas loop: scatter → converge. Returns a cancel + skip pair. */
export function playFormation(canvas, image, { onComplete }) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const ctx = canvas.getContext('2d', { alpha: false })
  const muted = toneCanvas(image, 52, 112)
  const final = toneCanvas(image, 110, 98)
  const { cols, rows } = fragmentCounts()
  const cells = buildFragments(image.naturalWidth, image.naturalHeight, cols, rows)

  let start = 0
  let raf = 0
  let stopped = false

  const size = () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    canvas.width = Math.round(vw * dpr)
    canvas.height = Math.round(vh * dpr)
    canvas.style.width = `${vw}px`
    canvas.style.height = `${vh}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    return formedRect(vw, vh)
  }

  let rect = size()
  ctx.fillStyle = '#faf7f2'
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

  const tick = (now) => {
    if (stopped) return
    if (!start) start = now
    const t = Math.min(1, (now - start) / FORM_MS)
    paint(ctx, cells, muted, final, image.naturalWidth, image.naturalHeight, rect, t, window.innerWidth, window.innerHeight)
    if (t < 1) raf = requestAnimationFrame(tick)
    else onComplete()
  }

  raf = requestAnimationFrame(tick)

  return {
    skip() {
      if (stopped) return
      paint(ctx, cells, muted, final, image.naturalWidth, image.naturalHeight, rect, 1, window.innerWidth, window.innerHeight)
      stopped = true
      cancelAnimationFrame(raf)
    },
    stop() {
      stopped = true
      cancelAnimationFrame(raf)
    },
  }
}
