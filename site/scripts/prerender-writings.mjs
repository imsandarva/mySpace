import { access, cp, mkdir, readFile, rm, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { renderArticle } from '../server/page.js'
import { moreWriting } from '../server/related.js'
import { listPublished } from '../server/store.js'

/* One static page per piece, with the essay and the link-preview tags already in the HTML.
   Netlify runs this as part of `npm run build`, so a shared link does not depend on JavaScript. */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const out = path.join(root, 'writing')
const exists = async (p) => { try { await access(p); return true } catch { return false } }

const built = await readFile(path.join(root, 'index.html'), 'utf8')
const href = built.match(/href="(\.\/assets\/[^"]+\.css)"/)?.[1]
if (!href) throw new Error('The built stylesheet was not found in index.html.')
const cssHref = `../../${href.slice(2)}`

await rm(out, { recursive: true, force: true })
const posts = await listPublished()
for (const post of posts) {
  const from = path.join(root, 'content', 'writing', post.slug)
  const dir = path.join(out, post.slug)
  await mkdir(dir, { recursive: true })
  if (await exists(path.join(from, 'images'))) await cp(path.join(from, 'images'), path.join(dir, 'images'), { recursive: true })
  if (post.og && await exists(path.join(from, post.og))) await cp(path.join(from, post.og), path.join(dir, post.og))
  await writeFile(path.join(dir, 'index.html'), renderArticle({ post, cssHref, edit: false, more: moreWriting(post, posts) }))
}
console.log(`Prerendered ${posts.length} ${posts.length === 1 ? 'piece' : 'pieces'}.`)
