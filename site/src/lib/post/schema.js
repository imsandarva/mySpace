import { isISODate, todayISO } from './dates.js'

/* The document is JSON, not HTML. schemaVersion is 1 so a later editor can still open what gets written today.
   Unknown nodes are dropped on the way in; text is escaped on the way out. Both have to be true. */

export const SCHEMA_VERSION = 1
export const emptyDoc = () => ({ type: 'doc', content: [{ type: 'paragraph' }] })

const IMAGE = /^images\/(?:[a-f0-9]{16}-(?:800|1600|2400)|preview)\.webp$/
const OG = /^og-[a-f0-9]{10}\.webp$/
const BLOCKS = new Set(['paragraph', 'heading', 'blockquote', 'bulletList', 'orderedList', 'listItem'])

export const fail = (status, message) => Object.assign(new Error(message), { status })

export const safeHref = (href = '') => {
  const h = String(href).trim()
  if (/^https:\/\//i.test(h) || /^http:\/\//i.test(h) || /^mailto:/i.test(h)) return h
  return ''
}

export const tidyHref = (raw = '') => {
  const t = String(raw).trim()
  if (!t) return ''
  return safeHref(/^(https?:|mailto:)/i.test(t) ? t : `https://${t}`)
}

const clip = (s, n) => String(s ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, n)
const num = (n) => (Number.isFinite(n) && n > 0 && n < 20000 ? Math.round(n) : null)

const mark = (m) => {
  if (m?.type === 'bold') return { type: 'bold' }
  if (m?.type === 'italic') return { type: 'italic' }
  if (m?.type === 'link') { const href = safeHref(m.attrs?.href); return href ? { type: 'link', attrs: { href } } : null }
  return null
}

const media = (src) => (IMAGE.test(String(src || '').trim()) ? String(src).trim() : '')

/* Column sits on the text. Wide breaks out on desktop with a tight inset; unknown values become column. */
const figureLayout = (value) => (value === 'wide' ? 'wide' : 'column')

const figure = (node) => {
  const src = media(node.attrs?.src)
  if (!src) return null
  const srcset = String(node.attrs?.srcset || '').split(',').map((part) => {
    const [url, desc] = part.trim().split(/\s+/)
    const safe = media(url)
    return safe ? `${safe}${/^(\d+)w$/.test(desc || '') ? ` ${desc}` : ''}` : ''
  }).filter(Boolean).join(', ')
  return { type: 'figure', attrs: { src, srcset, width: num(node.attrs?.width), height: num(node.attrs?.height), alt: clip(node.attrs?.alt, 300), caption: clip(node.attrs?.caption, 500), layout: figureLayout(node.attrs?.layout) } }
}

/* `budget` caps a hostile or accidental document before it is written to disk. */
const clean = (node, depth, budget) => {
  if (!node || typeof node !== 'object' || depth > 40 || ++budget.n > 8000) return null
  if (node.type === 'text') {
    const text = String(node.text || '').replace(/\u0000/g, '')
    if (!text) return null
    const marks = (node.marks || []).map(mark).filter(Boolean)
    return marks.length ? { type: 'text', text, marks } : { type: 'text', text }
  }
  if (node.type === 'hardBreak') return { type: 'hardBreak' }
  if (node.type === 'figure') return figure(node)
  if (node.type === 'doc') return { type: 'doc', content: blocks(node.content, depth, budget) }
  if (!BLOCKS.has(node.type)) return null
  if (node.type === 'heading') return { type: 'heading', attrs: { level: node.attrs?.level === 3 ? 3 : 2 }, content: inline(node.content, depth, budget) }
  if (node.type === 'paragraph') return { type: 'paragraph', content: inline(node.content, depth, budget) }
  if (node.type === 'bulletList' || node.type === 'orderedList') {
    const content = (node.content || []).map((n) => (n?.type === 'listItem' ? clean(n, depth + 1, budget) : null)).filter(Boolean)
    return content.length ? { type: node.type, content } : null
  }
  return { type: node.type, content: blocks(node.content, depth, budget) }
}

const inline = (nodes, depth, budget) => (nodes || []).map((n) => (n?.type === 'text' || n?.type === 'hardBreak' ? clean(n, depth + 1, budget) : null)).filter(Boolean)
const blocks = (nodes, depth, budget) => {
  const content = (nodes || []).map((n) => (n?.type === 'text' || n?.type === 'hardBreak' ? null : clean(n, depth + 1, budget))).filter(Boolean)
  return content.length ? content : [{ type: 'paragraph' }]
}

export const sanitizeDoc = (doc) => clean(doc?.type === 'doc' ? doc : emptyDoc(), 0, { n: 0 }) || emptyDoc()

export const isDocEmpty = (doc) => (doc?.content || []).every((n) => n.type === 'paragraph' && !n.content?.length)

export const isBlank = (post) => !post?.title?.trim() && !post?.subtitle?.trim() && !post?.preview && isDocEmpty(post?.doc)

const preview = (value) => {
  if (!value || typeof value !== 'object') return null
  const src = media(value.src)
  if (!src) return null
  return { src, width: num(value.width), height: num(value.height) }
}

/* Keep only the fields the reader knows. Anything else a request sends is ignored. */
export const normalize = (input, id) => {
  if (input?.schemaVersion && input.schemaVersion !== SCHEMA_VERSION) throw fail(409, 'This piece uses a newer format than this site knows.')
  const doc = sanitizeDoc(input?.doc)
  if (!doc) throw fail(413, 'This piece is too long to save.')
  return {
    schemaVersion: SCHEMA_VERSION,
    id,
    slug: typeof input?.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug) ? input.slug : null,
    title: clip(input?.title, 180),
    subtitle: clip(input?.subtitle, 300),
    published: isISODate(input?.published) ? input.published : todayISO(),
    updatedAt: new Date().toISOString(),
    preview: preview(input?.preview),
    og: OG.test(input?.og || '') ? input.og : null,
    doc,
  }
}
