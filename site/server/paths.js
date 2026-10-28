import path from 'path'
import { fileURLToPath } from 'url'
import { fail } from '../src/lib/post/schema.js'

/* Every file the writer can touch lives under two roots. A request never chooses a path; it chooses an id or a slug, and these helpers join it. */

const here = path.dirname(fileURLToPath(import.meta.url))

export const repoRoot = path.resolve(here, '../..')
export const contentDir = path.join(repoRoot, 'content', 'writing')
export const draftsDir = path.join(repoRoot, 'drafts')

export const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const IMAGE_RE = /^(?:[a-f0-9]{16}-(?:800|1600|2400)|preview)\.webp$/
export const OG_RE = /^og-[a-f0-9]{10}\.webp$/

export const assertId = (id) => { if (!ID_RE.test(id || '')) throw fail(400, 'That piece could not be found.') }
export const assertSlug = (slug) => { if (!SLUG_RE.test(slug || '')) throw fail(404, 'That piece could not be found.') }

/* Refuse anything that would resolve outside `root`, including encoded dots and absolute paths. */
export const inside = (root, ...parts) => {
  const base = path.resolve(root)
  const target = path.resolve(base, ...parts)
  const rel = path.relative(base, target)
  if (!rel || rel.split(path.sep).includes('..')) throw fail(400, 'That path is not allowed.')
  return target
}

export const draftPath = (id) => { assertId(id); return inside(draftsDir, id) }
export const piecePath = (slug) => { assertSlug(slug); return inside(contentDir, slug) }
