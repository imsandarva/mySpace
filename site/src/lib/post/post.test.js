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

test('an empty piece is blank, a titled one is not', () => {
  assert.equal(isBlank(normalize({ title: '  ' }, id)), true)
  assert.equal(isBlank(normalize({ title: 'A note' }, id)), false)
})
