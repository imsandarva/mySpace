import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { inside } from './paths.js'

test('a joined path cannot leave its root', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'writing-'))
  try {
    assert.equal(inside(root, 'a', 'b'), path.join(root, 'a', 'b'))
    assert.throws(() => inside(root, '..', 'etc'))
    assert.throws(() => inside(root, 'a', '..', '..', 'etc'))
    assert.throws(() => inside(root))
  } finally { await rm(root, { recursive: true, force: true }) }
})
