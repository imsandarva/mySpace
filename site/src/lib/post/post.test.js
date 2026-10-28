import assert from 'node:assert/strict'
import test from 'node:test'
import { allocateSlug } from './slug.js'
import { isBlank, normalize, safeHref } from './schema.js'
import { renderDoc } from './markup.js'

const id = '12345678-1234-1234-1234-123456789abc'

test('a slug is chosen once and then left alone when the title changes', () => {
  const taken = new Set(['note'])
  assert.equal(allocateSlug('Note', taken), 'note-2')
  assert.equal(allocateSlug('A title: here', new Set()), 'a-title-here')
})

test('javascript links are dropped and text is escaped', () => {
  assert.equal(safeHref('javascript:alert(1)'), '')
  assert.equal(safeHref('https://example.com/a'), 'https://example.com/a')
  const post = normalize({
    title: 'Hello',
    doc: { type: 'doc', content: [{ type: 'paragraph', content: [
      { type: 'text', text: '<script>' },
      { type: 'hardBreak' },
      { type: 'text', text: 'ok', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }, { type: 'bold' }] },
    ] }, { type: 'paragraph', content: [{ type: 'text', text: 'next' }] }, { type: 'evil', content: [] }] },
  }, id)
  const html = renderDoc(post.doc, (src) => src)
  assert.match(html, /&lt;script&gt;/)
  assert.doesNotMatch(html, /javascript/)
  assert.match(html, /<br>/)
  assert.match(html, /<p>next<br><\/p>|<p>next<\/p>/)
  assert.equal(html.includes('evil'), false)
})

test('a paragraph break and a soft break stay different', () => {
  const html = renderDoc({ type: 'doc', content: [
    { type: 'paragraph', content: [{ type: 'text', text: 'a' }, { type: 'hardBreak' }, { type: 'text', text: 'b' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'c' }] },
  ] }, (src) => src)
  assert.equal(html, '<p>a<br>b</p><p>c</p>')
})

test('italic and bold survive, unknown marks do not', () => {
  const post = normalize({ title: 'x', doc: { type: 'doc', content: [{ type: 'paragraph', content: [
    { type: 'text', text: 'a', marks: [{ type: 'italic' }] },
    { type: 'text', text: 'b', marks: [{ type: 'highlight' }] },
  ] }] } }, id)
  assert.equal(renderDoc(post.doc, (src) => src), '<p><em>a</em>b</p>')
})

test('the empty line kept after a last figure is not shown to readers', () => {
  const html = renderDoc({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'a' }] }, { type: 'paragraph' }] }, (src) => src)
  assert.equal(html, '<p>a</p>')
})

test('a wide figure gets wide sizes, and anything else stays in the column', () => {
  const src = 'images/0123456789abcdef-2400.webp'
  const post = normalize({ doc: { type: 'doc', content: [
    { type: 'figure', attrs: { src, layout: 'wide', alt: 'Dunes', caption: 'Morning', width: 2400, height: 1400, srcset: 'images/0123456789abcdef-800.webp 800w, images/0123456789abcdef-1600.webp 1600w, images/evil.webp 999w, images/0123456789abcdef-2400.webp 2400w' } },
    { type: 'figure', attrs: { src: 'images/0123456789abcdef-1600.webp', layout: 'full-bleed', srcset: 'images/0123456789abcdef-800.webp 800w, images/0123456789abcdef-1600.webp 1600w' } },
    { type: 'figure', attrs: { src: 'images/0123456789abcdef-1600.webp', layout: 'wide"><img' } },
  ] } }, id)
  assert.equal(post.doc.content[0].attrs.layout, 'wide')
  assert.equal(post.doc.content[1].attrs.layout, 'column')
  assert.equal(post.doc.content[2].attrs.layout, 'column')
  assert.match(post.doc.content[0].attrs.srcset, /2400\.webp 2400w/)
  assert.doesNotMatch(post.doc.content[0].attrs.srcset, /evil/)
  const html = renderDoc(post.doc, (s) => s)
  assert.equal(html.match(/is-wide/g).length, 1)
  assert.match(html, /sizes="\(min-width: 64rem\) calc\(100vw - 3\.5rem\), calc\(100vw - 2\.25rem\)"/)
  assert.match(html, /sizes="\(min-width: 48rem\) 35rem, calc\(100vw - 2.5rem\)"/)
  assert.match(html, /<figcaption>Morning<\/figcaption>/)
  assert.doesNotMatch(html, /full-bleed|onload/)
})

test('an empty piece is blank, a titled one is not', () => {
  assert.equal(isBlank(normalize({ title: '  ' }, id)), true)
  assert.equal(isBlank(normalize({ title: 'A note' }, id)), false)
})
