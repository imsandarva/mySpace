import { createHash } from 'crypto'
import { access, cp, mkdir, readdir, readFile, rename, rm, writeFile } from 'fs/promises'
import path from 'path'
import { emptyDoc, fail, isBlank, normalize } from '../src/lib/post/schema.js'
import { todayISO } from '../src/lib/post/dates.js'
import { firstFigure, referencedImages } from '../src/lib/post/figures.js'
import { allocateSlug } from '../src/lib/post/slug.js'
import { visibleDrafts } from '../src/lib/post/summary.js'
import { makeOg } from './images.js'
import { ID_RE, IMAGE_RE, SLUG_RE, assertId, contentDir, draftPath, draftsDir, inside, piecePath } from './paths.js'

const exists = async (p) => { try { await access(p); return true } catch { return false } }

const writeJson = async (file, data) => {
  await mkdir(path.dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.tmp`
  await writeFile(tmp, `${JSON.stringify(data, null, 2)}\n`)
  await rename(tmp, file)
}

export const readDraft = async (id) => {
  try { return JSON.parse(await readFile(path.join(draftPath(id), 'post.json'), 'utf8')) } catch { return null }
}

export const readPublishedSlug = async (slug) => {
  if (!SLUG_RE.test(slug || '')) return null
  try {
    const post = JSON.parse(await readFile(path.join(piecePath(slug), 'post.json'), 'utf8'))
    return post?.schemaVersion === 1 && post.slug === slug ? post : null
  } catch { return null }
}

export const listPublished = async () => {
  let names = []
  try { names = await readdir(contentDir) } catch { return [] }
  const posts = []
  for (const name of names) {
    if (!SLUG_RE.test(name)) continue
    const post = await readPublishedSlug(name)
    if (post) posts.push(post)
    else console.warn(`Skipping content/writing/${name}: unreadable or a newer format.`)
  }
  return posts
}

export const findPublished = async (id) => (await listPublished()).find((p) => p.id === id) || null

/* Every unpublished draft, newest edit first. Nothing here is removed for age or inactivity.
   A folder that is only the working copy of a live piece stays out — Edit on that piece still opens it. */
export const listUnpublished = async () => {
  let entries = []
  try { entries = await readdir(draftsDir, { withFileTypes: true }) } catch { return [] }
  const live = new Set((await listPublished()).map((p) => p.id))
  const posts = []
  for (const ent of entries) {
    if (!ent.isDirectory() || !ID_RE.test(ent.name)) continue
    const post = await readDraft(ent.name)
    if (!post || post.schemaVersion !== 1 || post.id !== ent.name) {
      console.warn(`Skipping drafts/${ent.name}: unreadable or a newer format.`)
      continue
    }
    posts.push(post)
  }
  return visibleDrafts(posts, live)
}

export const blank = (id) => ({ schemaVersion: 1, id, slug: null, title: '', subtitle: '', published: todayISO(), updatedAt: null, preview: null, og: null, doc: emptyDoc() })

/* Editing a published piece copies it into drafts first, so autosave never touches the live files. */
export const openSession = async (id) => {
  assertId(id)
  const live = await findPublished(id)
  if (await readDraft(id)) return { post: await readDraft(id), live: !!live, saved: true }
  if (!live) return { post: blank(id), live: false, saved: false }
  await mkdir(draftsDir, { recursive: true })
  try { await cp(piecePath(live.slug), draftPath(id), { recursive: true }) }
  catch (err) { if (!await readDraft(id)) throw err }
  return { post: await readDraft(id), live: true, saved: true }
}

export const saveDraft = async (input) => {
  assertId(input?.id)
  const live = await findPublished(input.id)
  const post = normalize(input, input?.id)
  post.slug = live?.slug || null
  if (live?.og) post.og = live.og
  if (isBlank(post) && !await readDraft(post.id) && !live) return post
  post.updatedAt = new Date().toISOString()
  await writeJson(path.join(draftPath(post.id), 'post.json'), post)
  return post
}

const copyImage = async (name, fromDirs, destDir) => {
  for (const dir of fromDirs) {
    const src = path.join(dir, name)
    if (await exists(src)) { await cp(src, path.join(destDir, name)); return }
  }
  throw fail(400, 'An image in this piece is missing. Add it again.')
}

/* Publish writes a new folder, then swaps it into place. A crash mid-write leaves the previous piece intact. */
export const publishPost = async (input) => {
  assertId(input?.id)
  const live = await findPublished(input.id)
  const post = normalize(input, input.id)
  if (!post.title) throw fail(400, 'Add a title first.')
  post.slug = live?.slug || allocateSlug(post.title, new Set((await listPublished()).map((p) => p.slug)))
  post.updatedAt = new Date().toISOString()

  await mkdir(contentDir, { recursive: true })
  const staging = path.join(contentDir, `.staging-${post.id}`)
  await rm(staging, { recursive: true, force: true })
  try {
    const imageDir = path.join(staging, 'images')
    await mkdir(imageDir, { recursive: true })
    const sources = [path.join(draftPath(post.id), 'images'), ...(live ? [path.join(piecePath(live.slug), 'images')] : [])]
    for (const rel of referencedImages(post)) {
      const name = path.basename(rel)
      if (!IMAGE_RE.test(name)) throw fail(400, 'An image path was not valid.')
      await copyImage(name, sources, imageDir)
    }
    post.og = await writeOg(post, staging)
    await writeJson(path.join(staging, 'post.json'), post)
  } catch (err) {
    await rm(staging, { recursive: true, force: true })
    throw err
  }

  const dest = piecePath(post.slug)
  const backup = path.join(contentDir, `.backup-${post.id}`)
  await rm(backup, { recursive: true, force: true })
  if (await exists(dest)) await rename(dest, backup)
  try { await rename(staging, dest) }
  catch (err) {
    if (!await exists(dest) && await exists(backup)) await rename(backup, dest)
    throw err
  }
  await rm(backup, { recursive: true, force: true })
  await rm(draftPath(post.id), { recursive: true, force: true })
  return post
}

const writeOg = async (post, dir) => {
  const rel = post.preview?.src || firstFigure(post.doc)?.src
  if (!rel) return null
  const source = path.join(dir, 'images', path.basename(rel))
  if (!await exists(source)) return null
  const buf = await makeOg(await readFile(source))
  const file = `og-${createHash('sha1').update(buf).digest('hex').slice(0, 10)}.webp`
  await writeFile(inside(dir, file), buf)
  return file
}

export const unpublish = async (id) => {
  assertId(id)
  const live = await findPublished(id)
  if (!live) return (await readDraft(id)) || blank(id)
  if (!await readDraft(id)) {
    await mkdir(draftsDir, { recursive: true })
    await cp(piecePath(live.slug), draftPath(id), { recursive: true })
  }
  const draft = await readDraft(id)
  if (!draft) throw fail(500, 'Could not keep a copy, so nothing was unpublished.')
  await rm(piecePath(live.slug), { recursive: true, force: true })
  return draft
}

export const removePiece = async (id) => {
  assertId(id)
  const live = await findPublished(id)
  await rm(draftPath(id), { recursive: true, force: true })
  if (live) await rm(piecePath(live.slug), { recursive: true, force: true })
}
