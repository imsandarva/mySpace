import { safeHref } from './schema.js'

/* The reader. The editor's document becomes this HTML, and the reading page styles it.
   Text is always escaped. A mark or a path that isn't one of ours is left out, not rendered raw. */

const IMAGE = /^images\/(?:[a-f0-9]{16}-(?:800|1600)|preview)\.webp$/

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const num = (n) => (Number.isFinite(n) && n > 0 ? String(Math.round(n)) : '')

const text = (node) => {
  let html = esc(node.text || '')
  for (const mark of node.marks || []) {
    if (mark.type === 'bold') html = `<strong>${html}</strong>`
    else if (mark.type === 'italic') html = `<em>${html}</em>`
    else if (mark.type === 'link') {
      const href = safeHref(mark.attrs?.href)
      if (!href) continue
      const blank = href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener noreferrer"'
      html = `<a href="${esc(href)}"${blank}>${html}</a>`
    }
  }
  return html
}

const figure = (node, resolve, eager) => {
  const a = node.attrs || {}
  if (!IMAGE.test(a.src || '')) return ''
  const src = resolve(a.src)
  if (!src) return ''
  const srcset = String(a.srcset || '').split(',').map((part) => {
    const [url, desc] = part.trim().split(/\s+/)
    if (!IMAGE.test(url || '')) return ''
    const safe = resolve(url)
    return safe ? `${safe}${/^(\d+)w$/.test(desc || '') ? ` ${desc}` : ''}` : ''
  }).filter(Boolean).join(', ')
  const size = `${num(a.width) ? ` width="${num(a.width)}"` : ''}${num(a.height) ? ` height="${num(a.height)}"` : ''}`
  const cap = (a.caption || '').trim()
  /* 35rem matches --measure-essay, so the browser fetches the size the column actually shows. */
  return `<figure class="fig"><img src="${esc(src)}"${srcset ? ` srcset="${esc(srcset)}" sizes="(min-width: 48rem) 35rem, calc(100vw - 2.5rem)"` : ''} alt="${esc(a.alt || '')}"${size} loading="${eager.used ? 'lazy' : 'eager'}" decoding="async">${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>`
}

/* The editor keeps one empty line after a trailing figure so you can keep writing; a reader should not get it as blank space. */
const trimEnd = (nodes = []) => {
  let end = nodes.length
  while (end > 1 && nodes[end - 1].type === 'paragraph' && !nodes[end - 1].content?.length) end -= 1
  return nodes.slice(0, end)
}

const render = (node, resolve, eager) => {
  if (!node) return ''
  const kids = () => (node.content || []).map((n) => render(n, resolve, eager)).join('')
  switch (node.type) {
    case 'doc': return trimEnd(node.content).map((n) => render(n, resolve, eager)).join('')
    case 'paragraph': return `<p>${kids() || '<br>'}</p>`
    case 'heading': { const level = node.attrs?.level === 3 ? 3 : 2; return `<h${level}>${kids()}</h${level}>` }
    case 'blockquote': return `<blockquote>${kids()}</blockquote>`
    case 'bulletList': return `<ul>${kids()}</ul>`
    case 'orderedList': return `<ol>${kids()}</ol>`
    case 'listItem': return `<li>${kids()}</li>`
    case 'hardBreak': return '<br>'
    case 'text': return text(node)
    case 'figure': { const html = figure(node, resolve, eager); if (html) eager.used = true; return html }
    default: return ''
  }
}

/* `resolve` turns a stored `images/…` path into the URL the page should request. */
export const renderDoc = (doc, resolve) => render(doc, resolve, { used: false })
