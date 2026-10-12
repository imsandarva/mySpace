import { BOOK } from './model'
import { luminance, toneOf } from './tones'

/* Paints a book's three surfaces onto 2D canvases (front, spine; the back stays a plain material colour).
   Real artwork is used whenever the data has `cover`; otherwise a considered typographic cover from the book's
   true title and author, in the site's own typefaces. Orientation matches the GLB's UVs: everything is drawn upright. */

const SERIF = '"Fraunces Variable", Georgia, serif'
const SANS = '"Instrument Sans Variable", system-ui, sans-serif'
const TIER_WIDTH = { lg: 1024, md: 640, sm: 384 }
export const ASPECT = BOOK.width / BOOK.height
const SPINE_RATIO = BOOK.depth / BOOK.height

export const ensureFonts = () => Promise.all([document.fonts.load(`480 64px ${SERIF}`), document.fonts.load(`600 24px ${SANS}`)]).catch(() => {})

const canvasOf = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')] }

/* ---------- materials: subtle, never uniform ---------- */

const MATERIAL = {
  /* Fine woven cloth: a faint crossing of threads. */
  cloth(ctx, w, h) {
    const step = Math.max(3, Math.round(w / 170))
    ctx.fillStyle = 'rgba(0,0,0,0.085)'
    for (let y = 0; y < h; y += step) ctx.fillRect(0, y, w, 1)
    for (let x = 0; x < w; x += step) ctx.fillRect(x, 0, 1, h)
    ctx.fillStyle = 'rgba(255,255,255,0.045)'
    for (let y = step / 2; y < h; y += step) ctx.fillRect(0, y, w, 1)
  },
  /* Matte printed paper: fine grain. */
  matte(ctx, w, h) {
    const [tile, t] = canvasOf(128, 128)
    const img = t.createImageData(128, 128)
    for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() > 0.5 ? 255 : 0; img.data.set([v, v, v, Math.random() * 16], i) }
    t.putImageData(img, 0, 0)
    ctx.fillStyle = ctx.createPattern(tile, 'repeat')
    ctx.fillRect(0, 0, w, h)
  },
  /* Smooth board: nothing added; the lighting carries the sheen. */
  board() {},
}

/* ---------- typesetting ---------- */

function wrap(ctx, text, maxW) {
  const lines = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word
    if (line && ctx.measureText(next).width > maxW) { lines.push(line); line = word } else line = next
  }
  return line ? [...lines, line] : lines
}

/* Fewest lines first, then the narrowest measure that keeps that count — balanced, no orphans. */
function balanced(ctx, text, maxW) {
  const n = wrap(ctx, text, maxW).length
  let [lo, hi] = [maxW * 0.45, maxW]
  while (hi - lo > 2) { const mid = (lo + hi) / 2; if (wrap(ctx, text, mid).length > n) lo = mid; else hi = mid }
  return wrap(ctx, text, hi)
}

/* Largest size ≤ `size` at which the longest single word still fits the measure. */
function fitSize(ctx, text, size, maxW, font) {
  const longest = (px) => { ctx.font = font(px); return Math.max(...text.split(/\s+/).map((w) => ctx.measureText(w).width)) }
  while (size > 8 && longest(size) > maxW) size *= 0.94
  return size
}

/* Lettering pressed into the material: a hair of shadow above, a hair of light below, then the colour. */
function stamp(ctx, text, x, y, color, dark, s) {
  ctx.fillStyle = dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)'; ctx.fillText(text, x, y + s)
  ctx.fillStyle = dark ? 'rgba(0,0,0,0.32)' : 'rgba(0,0,0,0.1)'; ctx.fillText(text, x, y - s)
  ctx.fillStyle = color; ctx.fillText(text, x, y)
}

/* Title block: balanced lines at the best size. Returns the lines, size and total height. */
function setTitle(ctx, book, w, maxW, k) {
  const font = (px) => `480 ${px}px ${SERIF}`
  const size = fitSize(ctx, book.name, (book.fit / 100) * w * k, maxW, font)
  ctx.font = font(size)
  return { lines: balanced(ctx, book.name, maxW), size, lh: size * 1.04, font: font(size) }
}

function setAuthor(ctx, book, w, maxW) {
  const size = w * 0.034
  ctx.font = `600 ${size}px ${SANS}`
  ctx.letterSpacing = `${size * 0.07}px`
  return { lines: wrap(ctx, book.author.toUpperCase(), maxW), size, lh: size * 1.3 }
}

const blockH = (b) => b.lines.length * b.lh

/* ---------- the three cover layouts (so a shelf doesn't read as one stamped template) ---------- */

const LAYOUT = {
  /* a — title top-left, author bottom-left, a short rule between worlds */
  a(ctx, w, h, book, c) {
    const [L, R, T, B] = [0.158 * w, 0.092 * w, 0.118 * w, 0.105 * w]
    const t = setTitle(ctx, book, w, w - L - R, 1)
    ctx.textBaseline = 'top'; ctx.textAlign = 'left'
    ctx.font = t.font
    t.lines.forEach((ln, i) => stamp(ctx, ln, L, T + i * t.lh, c.on, c.dark, c.s))
    const a = setAuthor(ctx, book, w, w - L - R)
    const top = h - B - blockH(a)
    ctx.fillStyle = c.on; ctx.globalAlpha = 0.5; ctx.fillRect(L, top - w * 0.05, w * 0.12, Math.max(1.5, w / 700)); ctx.globalAlpha = 1
    ctx.font = `600 ${a.size}px ${SANS}`; ctx.letterSpacing = `${a.size * 0.07}px`
    a.lines.forEach((ln, i) => stamp(ctx, ln, L, top + i * a.lh, c.on, c.dark, c.s))
  },
  /* b — a blind-stamped frame, title and author centred inside it */
  b(ctx, w, h, book, c) {
    const [x, y, fw, fh] = [0.151 * w, 0.105 * w, w - 0.151 * w - 0.079 * w, h - 0.21 * w]
    ctx.strokeStyle = c.on; ctx.globalAlpha = 0.42; ctx.lineWidth = Math.max(1, w / 700); ctx.strokeRect(x, y, fw, fh); ctx.globalAlpha = 1
    const maxW = fw - 0.1 * w
    const t = setTitle(ctx, book, w, maxW, 0.84)
    const a = setAuthor(ctx, book, w, maxW)
    const total = blockH(t) + 0.07 * w + blockH(a)
    let cy = y + (fh - total) / 2
    ctx.textBaseline = 'top'; ctx.textAlign = 'center'
    ctx.font = t.font
    t.lines.forEach((ln, i) => stamp(ctx, ln, x + fw / 2, cy + i * t.lh, c.on, c.dark, c.s))
    cy += blockH(t) + 0.07 * w
    ctx.font = `600 ${a.size}px ${SANS}`; ctx.letterSpacing = `${a.size * 0.07}px`
    a.lines.forEach((ln, i) => stamp(ctx, ln, x + fw / 2, cy + i * a.lh, c.on, c.dark, c.s))
  },
  /* c — a title label set onto the cloth, author beneath */
  c(ctx, w, h, book, c) {
    const [L, R, T, B] = [0.17 * w, 0.105 * w, 0.17 * w, 0.105 * w]
    const pad = 0.05 * w
    const t = setTitle(ctx, book, w, w - L - R - pad * 2, 0.76)
    ctx.fillStyle = c.on; ctx.fillRect(L, T, w - L - R, blockH(t) + pad * 2)
    ctx.textBaseline = 'top'; ctx.textAlign = 'center'; ctx.font = t.font; ctx.fillStyle = c.bg
    t.lines.forEach((ln, i) => ctx.fillText(ln, L + (w - L - R) / 2, T + pad + i * t.lh))
    const a = setAuthor(ctx, book, w, w - L - R)
    ctx.textAlign = 'left'
    ctx.font = `600 ${a.size}px ${SANS}`; ctx.letterSpacing = `${a.size * 0.07}px`
    const top = h - B - blockH(a)
    a.lines.forEach((ln, i) => stamp(ctx, ln, L, top + i * a.lh, c.on, c.dark, c.s))
  },
}

/* ---------- artwork helpers ---------- */

/* Draw an image to fill the front board without distortion: centred crop to the board's proportions. */
function coverFit(ctx, img, w, h) {
  const k = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const [sw, sh] = [w / k, h / k]
  ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, w, h)
}

function averageColor(img) {
  const [, ctx] = canvasOf(1, 1)
  ctx.drawImage(img, 0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

const loadArt = (url) => new Promise((resolve) => {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => resolve(img)
  img.onerror = () => resolve(null)
  img.src = url
})

/* ---------- surfaces ---------- */

function paintFront(book, w, h, art, c) {
  const [canvas, ctx] = canvasOf(w, h)
  if (art) { coverFit(ctx, art, w, h); return canvas }
  ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h)
  MATERIAL[book.shape.material]?.(ctx, w, h)
  /* the hinge groove where the board meets the spine */
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(w * 0.052, 0, Math.max(1.5, w / 500), h)
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(w * 0.052 + Math.max(1.5, w / 500), 0, Math.max(1.5, w / 500), h)
  LAYOUT[book.shape.layout](ctx, w, h, book, c)
  return canvas
}

function paintSpine(book, h, thick, art, c) {
  const w = Math.round(h * SPINE_RATIO * thick)
  const [canvas, ctx] = canvasOf(w, h)
  ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h)
  if (!art) MATERIAL[book.shape.material]?.(ctx, w, h)
  const [T, B] = [h * 0.07, h * 0.07]
  ctx.textBaseline = 'middle'
  ctx.save(); ctx.translate(w / 2, T); ctx.rotate(Math.PI / 2); ctx.textAlign = 'left'
  let size = w * 0.34
  const font = (px) => `480 ${px}px ${SERIF}`
  ctx.font = font(size)
  const room = h * 0.6
  const width = ctx.measureText(book.name).width
  if (width > room) { size *= room / width; ctx.font = font(size) }
  stamp(ctx, book.name, 0, 0, c.on, c.dark, c.s)
  ctx.restore()
  ctx.save(); ctx.translate(w / 2, h - B); ctx.rotate(Math.PI / 2); ctx.textAlign = 'right'
  const asize = w * 0.19
  ctx.font = `600 ${asize}px ${SANS}`; ctx.letterSpacing = `${asize * 0.07}px`
  let author = book.author.toUpperCase()
  const aroom = h * 0.28
  if (ctx.measureText(author).width > aroom) { const ratio = aroom / ctx.measureText(author).width; ctx.font = `600 ${asize * ratio}px ${SANS}` }
  ctx.globalAlpha = 0.85; stamp(ctx, author, 0, 0, c.on, c.dark, c.s); ctx.restore()
  ctx.strokeStyle = c.on; ctx.globalAlpha = 0.35; ctx.lineWidth = Math.max(1, w / 90)
  for (const y of [h * 0.032, h * 0.968]) { ctx.beginPath(); ctx.moveTo(w * 0.22, y); ctx.lineTo(w * 0.78, y); ctx.stroke() }
  return canvas
}

/* The three surfaces of one book at a quality tier: { front, spine (canvases), back (CSS colour) }. */
export async function paintBook(book, tier, thick = 1) {
  await ensureFonts()
  const art = book.cover ? await loadArt(book.cover) : null
  const base = toneOf(book.tone)
  const bg = art ? averageColor(art) : base.bg /* with real art, spine and back take the artwork's own average colour */
  const dark = luminance(bg) < 0.45
  const on = art ? (dark ? '#f3efe6' : '#1c1c28') : base.on
  const c = { bg, on, dark, s: Math.max(0.6, tierWidth(tier) / 900) }
  const w = tierWidth(tier)
  const h = Math.round(w / ASPECT)
  return { front: paintFront(book, w, h, art, c), spine: paintSpine(book, h, thick, art, c), back: bg }
}

const tierWidth = (tier) => TIER_WIDTH[tier] ?? TIER_WIDTH.md
