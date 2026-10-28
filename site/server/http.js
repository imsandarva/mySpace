import { fail } from '../src/lib/post/schema.js'

export const isLoopback = (req) => {
  const ip = req.socket?.remoteAddress || ''
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1'
}

export const hostOk = (req) => {
  const host = String(req.headers.host || '').replace(/:\d+$/, '')
  return host === '127.0.0.1' || host === 'localhost' || host === '[::1]'
}

export const originOk = (req) => {
  const origin = req.headers.origin
  if (!origin) return true
  return /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(origin)
}

export const readBody = async (req, limit) => {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) { req.destroy(); throw fail(413, 'That is too large to save.') }
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

export const send = (res, status, body) => {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.setHeader('x-content-type-options', 'nosniff')
  res.end(JSON.stringify(body))
}

export const sendHtml = (res, status, html) => {
  res.statusCode = status
  res.setHeader('content-type', 'text/html; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.setHeader('x-content-type-options', 'nosniff')
  res.end(html)
}
