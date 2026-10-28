import { randomBytes } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { fail } from '../src/lib/post/schema.js'
import { IMAGE_RE, draftPath, inside } from './paths.js'

/* Phone photos carry GPS in EXIF. `rotate()` applies the orientation, and writing a new WebP without
   `withMetadata()` drops the rest, including location. Do not add `withMetadata()`. */

const MAX_PIXELS = 40_000_000

const sniff = (buf) => {
  if (buf.length > 2 && buf[0] === 0xff && buf[1] === 0xd8) return 'jpeg'
  if (buf.length > 8 && buf.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') return 'png'
  if (buf.length > 12 && buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') return 'webp'
  if (buf.length > 6 && buf.subarray(0, 3).toString() === 'GIF') return 'gif'
  if (buf.length > 12 && buf.subarray(4, 8).toString() === 'ftyp') return 'avif'
  return ''
}

const pipeline = (buffer) => sharp(buffer, { failOn: 'none', animated: false, limitInputPixels: MAX_PIXELS }).rotate()

const sized = (buffer, width) => pipeline(buffer).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true })

/* Largest first. 2400 covers a wide figure on a retina screen (the page frame is 76rem). Stop once a step would not be smaller. */
const LADDER = [2400, 1600, 800]

const renditions = async (buffer) => {
  const made = []
  let cap = Infinity
  for (const target of LADDER) {
    if (cap <= target) break
    const out = await sized(buffer, target)
    if (out.info.width >= cap) break
    made.push({ target, data: out.data, width: out.info.width, height: out.info.height })
    cap = out.info.width
  }
  return made
}

export const makeOg = async (input) => {
  const run = (position) => sharp(input, { failOn: 'none', animated: false, limitInputPixels: MAX_PIXELS }).rotate().resize(1200, 630, { fit: 'cover', position }).webp({ quality: 82 }).toBuffer()
  try { return await run('attention') } catch { return run('centre') }
}

/* `role` is `figure` (the essay ladder) or `preview` (the image used when the link is shared). */
export const storeImage = async (id, buffer, role) => {
  if (!Buffer.isBuffer(buffer) || !buffer.length) throw fail(400, 'That image was empty.')
  if (!sniff(buffer)) throw fail(400, 'Use a JPEG, PNG, WebP, or GIF.')
  const dir = inside(draftPath(id), 'images')
  await mkdir(dir, { recursive: true })
  try {
    if (role === 'preview') {
      const out = await sized(buffer, 1600)
      await writeFile(path.join(dir, 'preview.webp'), out.data)
      return { src: 'images/preview.webp', width: out.info.width, height: out.info.height }
    }
    const made = await renditions(buffer)
    if (!made.length) throw fail(400, 'That image could not be read.')
    const stamp = randomBytes(8).toString('hex')
    const parts = []
    for (const file of made) {
      const name = `${stamp}-${file.target}.webp`
      if (!IMAGE_RE.test(name)) throw fail(500, 'Could not name that image.')
      await writeFile(path.join(dir, name), file.data)
      parts.push(`images/${name} ${file.width}w`)
    }
    const largest = made[0]
    return { src: `images/${stamp}-${largest.target}.webp`, srcset: parts.reverse().join(', '), width: largest.width, height: largest.height }
  } catch (err) {
    if (err.status) throw err
    throw fail(400, 'That image could not be read.')
  }
}
