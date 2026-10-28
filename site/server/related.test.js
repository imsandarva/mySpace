import assert from 'node:assert/strict'
import test from 'node:test'
import { moreWriting } from './related.js'

const post = (slug, published) => ({ id: slug, slug, title: slug, subtitle: `about ${slug}`, published, doc: { type: 'doc', content: [] } })

test('more writing follows the collection order, never repeats the piece, and wraps round', () => {
  const posts = [post('a', '2099-03-01'), post('b', '2099-02-01'), post('c', '2099-01-01')]
  const slugs = (p) => moreWriting(p, posts, 2).map((w) => w.href)
  assert.deepEqual(slugs(posts[0]), ['../b/', '../c/'])
  assert.deepEqual(slugs(posts[2]).length, 2)
  assert.ok(!slugs(posts[2]).includes('../c/'))
})

test('a piece also on Substack is listed once, as the local one', () => {
  const posts = [post('antifragile', '2026-10-15'), post('zzz', '2099-01-01')]
  const hits = moreWriting(posts[1], posts, 20).filter((w) => w.title === 'antifragile')
  assert.equal(hits.length, 1)
  assert.equal(hits[0].external, false)
})
