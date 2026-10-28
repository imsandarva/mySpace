import { readFile } from 'fs/promises'
import { fail } from '../src/lib/post/schema.js'
import { storeImage } from './images.js'
import { renderArticle, renderMissing } from './page.js'
import { IMAGE_RE, OG_RE, draftPath, inside, piecePath } from './paths.js'
import { listPublished, listUnpublished, openSession, publishPost, readPublishedSlug, removePiece, saveDraft, unpublish } from './store.js'
import { moreWriting } from './related.js'
import { readBody, send, sendHtml } from './http.js'

const json = async (req) => {
  try { return JSON.parse((await readBody(req, 1_500_000)).toString('utf8') || '{}') }
  catch (err) { if (err.status) throw err; throw fail(400, 'That request could not be read.') }
}

const parts = (pathname) => pathname.split('/').filter(Boolean).map((s) => { try { return decodeURIComponent(s) } catch { return '' } })

const image = async (res, target) => {
  try {
    const data = await readFile(target)
    res.statusCode = 200
    res.setHeader('content-type', 'image/webp')
    res.setHeader('cache-control', 'no-store')
    res.setHeader('x-content-type-options', 'nosniff')
    res.end(data)
  } catch { send(res, 404, { error: 'That image is not here.' }) }
}

/* True when this server answered. False lets Vite keep the request. */
export const handle = async (req, res, url) => {
  const p = parts(url.pathname)
  const api = p[0] === 'api' && p[1] === 'write'
  const media = p[0] === 'media' && p[1] === 'draft'
  const writing = p[0] === 'writing' && p[1]
  if (!api && !media && !writing) return false

  if (api) {
    if (req.method === 'GET' && p.length === 3 && p[2] === 'drafts') { send(res, 200, { drafts: await listUnpublished() }); return true }
    if (req.method !== 'POST') { send(res, 404, { error: 'Not found.' }); return true }
    if (p[2] === 'session') send(res, 200, await openSession((await json(req)).id))
    else if (p[2] === 'draft') send(res, 200, await saveDraft(await json(req)))
    else if (p[2] === 'publish') send(res, 200, await publishPost(await json(req)))
    else if (p[2] === 'unpublish') send(res, 200, await unpublish((await json(req)).id))
    else if (p[2] === 'delete') { await removePiece((await json(req)).id); send(res, 200, { ok: true }) }
    else if (p[2] === 'image') {
      const role = req.headers['x-image-role'] === 'preview' ? 'preview' : 'figure'
      send(res, 200, await storeImage(req.headers['x-draft-id'], await readBody(req, 12 * 1024 * 1024), role))
    } else send(res, 404, { error: 'Not found.' })
    return true
  }

  if (media) {
    if (p.length === 5 && p[3] === 'images' && IMAGE_RE.test(p[4])) await image(res, inside(draftPath(p[2]), 'images', p[4]))
    else send(res, 404, { error: 'Not found.' })
    return true
  }

  const post = await readPublishedSlug(p[1])
  if (p.length === 4 && p[2] === 'images' && IMAGE_RE.test(p[3]) && post) { await image(res, inside(piecePath(p[1]), 'images', p[3])); return true }
  if (p.length === 3 && OG_RE.test(p[2]) && post?.og === p[2]) { await image(res, inside(piecePath(p[1]), p[2])); return true }
  if (p.length === 2) { sendHtml(res, post ? 200 : 404, post ? renderArticle({ post, cssHref: '/src/styles/index.css', edit: true, more: moreWriting(post, await listPublished()) }) : renderMissing('/src/styles/index.css')); return true }
  send(res, 404, { error: 'Not found.' })
  return true
}
