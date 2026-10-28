import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

/* The image used when a piece has none of its own. Cover-cropped once, then copied into the build by Vite. */
const dir = path.dirname(fileURLToPath(import.meta.url))
const painting = path.resolve(dir, '../public/assets/my_painting.webp')
const dest = path.resolve(dir, '../public/assets/og-default.webp')

const run = (position) => sharp(painting).rotate().resize(1200, 630, { fit: 'cover', position }).webp({ quality: 82 }).toFile(dest)
try { await run('attention') } catch { await run('centre') }
