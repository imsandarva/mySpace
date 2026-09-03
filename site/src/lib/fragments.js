/* Organic shatter: a jittered vertex grid, not uniform puzzle squares. */

export const PORTRAIT_RATIO = 2 / 3 /* 1024×1536 */

export function fragmentCounts() {
  const w = window.innerWidth
  if (w < 680) return { cols: 6, rows: 9 }
  if (w < 1024) return { cols: 8, rows: 12 }
  return { cols: 10, rows: 15 }
}

export function formedRect(vw, vh) {
  const maxH = Math.min(vh * 0.64, 580)
  let h = maxH
  let w = h * PORTRAIT_RATIO
  const maxW = Math.min(vw * 0.52, 400)
  if (w > maxW) { w = maxW; h = w / PORTRAIT_RATIO }
  return { x: (vw - w) / 2, y: (vh - h) / 2, w, h }
}

export function buildFragments(imgW, imgH, cols, rows) {
  const pts = []
  for (let r = 0; r <= rows; r++) {
    pts[r] = []
    for (let c = 0; c <= cols; c++) {
      const edgeX = c === 0 || c === cols
      const edgeY = r === 0 || r === rows
      const jx = edgeX ? 0 : (Math.random() - 0.5) * (imgW / cols) * 0.82
      const jy = edgeY ? 0 : (Math.random() - 0.5) * (imgH / rows) * 0.82
      pts[r][c] = { x: (c / cols) * imgW + jx, y: (r / rows) * imgH + jy }
    }
  }

  const cells = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 90 + Math.random() * 420
      cells.push({
        verts: [pts[r][c], pts[r][c + 1], pts[r + 1][c + 1], pts[r + 1][c]],
        delay: Math.random() * 0.36,
        rot: (Math.random() - 0.5) * 0.42,
        sx: Math.cos(angle) * dist,
        sy: Math.sin(angle) * dist,
        power: 2.6 + Math.random() * 1.6,
      })
    }
  }
  return cells
}

export function toneCanvas(image, contrast, brightness) {
  const c = document.createElement('canvas')
  c.width = image.naturalWidth
  c.height = image.naturalHeight
  const ctx = c.getContext('2d')
  ctx.filter = `grayscale(1) contrast(${contrast}%) brightness(${brightness}%)`
  ctx.drawImage(image, 0, 0)
  return c
}

export function easeOut(t, power) {
  const x = Math.min(1, Math.max(0, t))
  return 1 - (1 - x) ** power
}
