import assert from 'node:assert/strict'
import test from 'node:test'
import { visibleDrafts } from './summary.js'
import { wordsIn } from './words.js'

const doc = (...texts) => ({ type: 'doc', content: texts.map((text) => ({ type: 'paragraph', content: text ? [{ type: 'text', text }] : [] })) })

test('word count is the body, not the caption', () => {
  assert.equal(wordsIn(doc('one two', 'three')), 3)
  assert.equal(wordsIn({ type: 'doc', content: [{ type: 'figure', attrs: { alt: 'a tall caption here', caption: 'more words' } }, { type: 'paragraph' }] }), 0)
  assert.equal(wordsIn(null), 0)
})

test('a summary keeps the subtitle, and invents nothing when the piece is empty', () => {
  const row = visibleDrafts([{
    schemaVersion: 1, id: 'a', title: '  The shape  ', subtitle: 'A few opening thoughts',
    updatedAt: '2026-10-28T08:00:00.000Z', doc: doc('body that should not win'),
  }], new Set())
  assert.deepEqual(row, [{ id: 'a', title: 'The shape', excerpt: 'A few opening thoughts', updatedAt: '2026-10-28T08:00:00.000Z', words: 5 }])
  const empty = visibleDrafts([{ schemaVersion: 1, id: 'b', title: '  ', subtitle: '', doc: doc('') }], new Set())
  assert.equal(empty[0].title, '')
  assert.equal(empty[0].excerpt, '')
  assert.equal(empty[0].words, 0)
})

test('published copies are hidden, and an old draft stays, behind the newer one', () => {
  const posts = [
    { schemaVersion: 1, id: 'old', title: 'Years ago', updatedAt: '2019-01-01T00:00:00.000Z', doc: doc('still mine') },
    { schemaVersion: 1, id: 'live', title: 'On the site', updatedAt: '2026-10-28T00:00:00.000Z', doc: doc('editing') },
    { schemaVersion: 1, id: 'new', title: 'Today', updatedAt: '2026-10-28T12:00:00.000Z', doc: doc('fresh') },
    { schemaVersion: 2, id: 'future', title: 'Nope', doc: doc('x') },
  ]
  const rows = visibleDrafts(posts, new Set(['live']))
  assert.deepEqual(rows.map((r) => r.id), ['new', 'old'])
})
