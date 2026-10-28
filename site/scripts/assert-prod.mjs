import { access, readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

/* The editor and its write API must not be in the JavaScript that gets deployed. */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const html = await readFile(path.join(root, 'index.html'), 'utf8')
const entry = html.match(/src="(\.\/assets\/[^"]+\.js)"/)?.[1]
if (!entry) throw new Error('The built script was not found in index.html.')

const needles = ['@tiptap', '/api/write', 'prosemirror']
const exists = async (rel) => { try { await access(path.join(root, rel)); return true } catch { return false } }
const queue = [entry.slice(2)]
const seen = new Set()
while (queue.length) {
  const rel = queue.pop()
  if (!rel || seen.has(rel) || !await exists(rel)) continue
  seen.add(rel)
  const text = await readFile(path.join(root, rel), 'utf8')
  for (const needle of needles) {
    if (text.includes(needle)) throw new Error(`${rel} contains “${needle}”. The editor must not ship in the public site.`)
  }
  for (const match of text.matchAll(/(?:\.\/)?(?:assets\/)?[A-Za-z0-9._-]+\.js/g)) {
    const next = `assets/${match[0].replace(/^\.\//, '').replace(/^assets\//, '')}`
    if (!seen.has(next)) queue.push(next)
  }
}
if (!seen.size) throw new Error('No public scripts were checked.')
console.log(`Checked ${seen.size} public scripts.`)
