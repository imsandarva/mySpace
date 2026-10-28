import { excerpt } from './excerpt.js'
import { wordsIn } from './words.js'

const flat = (s) => String(s || '').replace(/\s+/g, ' ').trim()

/* Keep the author's words. Cut only for length, on a space, and never invent a line that isn't there. */
const clip = (s, max = 180) => {
  if (s.length <= max) return s
  const cut = s.slice(0, max)
  const at = cut.lastIndexOf(' ')
  return `${(at > 40 ? cut.slice(0, at) : cut).trim()}…`
}

/* What the drafts list needs. The document stays on disk. */
export const summarizeDraft = (post) => {
  const title = flat(post?.title)
  const subtitle = flat(post?.subtitle)
  const preview = subtitle || flat(excerpt(post?.doc, 180))
  return {
    id: post.id,
    title,
    excerpt: preview ? clip(preview, 180) : '',
    updatedAt: typeof post?.updatedAt === 'string' && post.updatedAt ? post.updatedAt : null,
    words: wordsIn(post?.doc),
  }
}

/* Newest edit first. Age only decides order — a draft is never dropped because it is old. */
export const byRecent = (a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '') || a.title.localeCompare(b.title) || a.id.localeCompare(b.id)

/* Unpublished only. A working copy of a piece that is already on the site is not a draft. */
export const visibleDrafts = (posts, liveIds) => (posts || [])
  .filter((post) => post?.schemaVersion === 1 && typeof post.id === 'string' && !liveIds.has(post.id))
  .map(summarizeDraft)
  .sort(byRecent)
