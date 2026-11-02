import assert from 'node:assert/strict'
import test from 'node:test'
import { byPublishedDesc, sortByPublishedDesc } from './order.js'

test('newest published day first; same day falls back to slug', () => {
  const items = [
    { slug: 'b', published: '2026-11-02' },
    { slug: 'a', published: '2026-11-02' },
    { slug: 'c', published: '2026-10-15' },
  ]
  assert.deepEqual(sortByPublishedDesc(items).map((w) => w.slug), ['a', 'b', 'c'])
  assert.ok(byPublishedDesc(items[0], items[1]) > 0)
})
