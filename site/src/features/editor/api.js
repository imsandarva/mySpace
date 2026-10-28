/* Talks only to the dev server. None of this is imported by the public site. */

const request = async (url, options) => {
  let res
  try { res = await fetch(url, options) }
  catch { throw new Error('Couldn’t reach the local server.') }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong.')
  return data
}

const post = (url, body) => request(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })

export const listDrafts = async () => {
  const data = await request('/api/write/drafts')
  if (!Array.isArray(data?.drafts)) throw new Error('Couldn’t read drafts.')
  return data.drafts
}

export const session = (id) => post('/api/write/session', { id })
export const saveDraft = (piece) => post('/api/write/draft', piece)
export const publishPiece = (piece) => post('/api/write/publish', piece)
export const unpublishPiece = (id) => post('/api/write/unpublish', { id })
export const deletePiece = (id) => post('/api/write/delete', { id })

export const upload = (id, file, role) => request('/api/write/image', {
  method: 'POST',
  headers: { 'content-type': file.type || 'application/octet-stream', 'x-draft-id': id, 'x-image-role': role },
  body: file,
})
