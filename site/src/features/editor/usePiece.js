import { useEffect, useRef, useState } from 'react'
import { deletePiece, publishPiece, saveDraft as save, session, unpublishPiece } from './api'
import { isBlank } from '../../lib/post/schema'

const keyOf = (id) => `writing-piece:${id}`
const readBackup = (id) => { try { return JSON.parse(localStorage.getItem(keyOf(id)) || 'null') } catch { return null } }
const writeBackup = (id, piece) => { try { localStorage.setItem(keyOf(id), JSON.stringify(piece)) } catch { /* private mode */ } }
const clearBackup = (id) => { try { localStorage.removeItem(keyOf(id)) } catch { /* private mode */ } }

/* Autosave to disk, with a copy in this browser so a crash between keystrokes and the save doesn't eat the piece. */
export function usePiece(id) {
  const piece = useRef(null)
  const setPiece = useRef(() => {})
  const status = useRef('loading')
  const setStatus = useRef(() => {})
  const live = useRef(false)
  const setLive = useRef(() => {})
  const error = useRef('')
  const setError = useRef(() => {})
  const view = useView(piece, setPiece, status, setStatus, live, setLive, error, setError)
  const pending = useRef(false)
  const queued = useRef(false)
  const retries = useRef(0)
  const timer = useRef(0)
  const leaving = useRef(false)
  const busy = useRef(false)
  const publishRef = useRef(() => {})

  const persist = async () => {
    if (leaving.current) return
    if (pending.current) { queued.current = true; return }
    pending.current = true
    try {
      do {
        queued.current = false
        if (leaving.current) break
        const snapshot = piece.current
        if (!snapshot) break
        if (isBlank(snapshot) && !live.current && !snapshot.updatedAt) { if (!busy.current) setStatus.current('fresh'); break }
        if (!busy.current) setStatus.current('saving')
        const saved = await save(snapshot)
        if (leaving.current) break
        const latest = piece.current || snapshot
        const next = { ...latest, slug: saved.slug, updatedAt: saved.updatedAt, og: saved.og, savedTouch: snapshot.touchedAt }
        piece.current = next
        setPiece.current(next)
        writeBackup(id, next)
        retries.current = 0
        if (!busy.current) setStatus.current('saved')
        setError.current('')
      } while (queued.current)
    } catch (err) {
      if (leaving.current) return
      if (!busy.current) setStatus.current('error')
      setError.current(err.message)
      if (retries.current < 3) { retries.current += 1; window.setTimeout(persist, 1200 * retries.current) }
    } finally { pending.current = false }
  }

  const change = (patch) => {
    const next = { ...(piece.current || {}), ...patch, touchedAt: Date.now() }
    piece.current = next
    setPiece.current(next)
    writeBackup(id, next)
    if (!busy.current) setStatus.current('dirty')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(persist, 400)
  }

  useEffect(() => {
    let cancel = false
    session(id).then((remote) => {
      if (cancel) return
      const local = readBackup(id)
      const dirty = local?.id === id && (local.touchedAt || 0) !== (local.savedTouch || 0)
      const post = local && (!remote.saved || dirty) ? { ...remote.post, ...local, id, slug: remote.post.slug || local.slug || null } : remote.post
      const clean = dirty || !remote.saved && local ? { ...post, touchedAt: local.touchedAt || Date.now() } : { ...post, touchedAt: 1, savedTouch: 1 }
      piece.current = clean
      setPiece.current(clean)
      live.current = remote.live
      setLive.current(remote.live)
      setStatus.current(remote.saved || remote.live ? 'saved' : 'fresh')
      if (dirty || (!remote.saved && local && !isBlank(local))) persist()
    }).catch((err) => { if (!cancel) { setStatus.current('error'); setError.current(err.message) } })

    const flush = () => { if (leaving.current || !piece.current || isBlank(piece.current)) return; persist() }
    const onHide = () => { if (document.visibilityState === 'hidden') flush() }
    const onLeave = (e) => {
      if (leaving.current || !['dirty', 'saving', 'error'].includes(status.current)) return
      e.preventDefault()
      e.returnValue = ''
    }
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey)) return
      if (e.key === 's') { e.preventDefault(); persist() }
      if (e.key === 'Enter') { e.preventDefault(); publishRef.current() }
    }
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', flush)
    window.addEventListener('beforeunload', onLeave)
    window.addEventListener('keydown', onKey)
    return () => {
      cancel = true
      window.clearTimeout(timer.current)
      flush() // leaving the page (Back) must not drop the last 400 ms of words
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('pagehide', flush)
      window.removeEventListener('beforeunload', onLeave)
      window.removeEventListener('keydown', onKey)
    }
  }, [id])

  const publish = async () => {
    if (busy.current) return
    if (!piece.current?.title?.trim()) { setError.current('Add a title first.'); return }
    busy.current = true
    setStatus.current('publishing')
    try {
      await persist()
      const saved = await publishPiece(piece.current)
      clearBackup(id)
      leaving.current = true
      window.location.assign(`/writing/${saved.slug}/`)
    } catch (err) { busy.current = false; setStatus.current('error'); setError.current(err.message) }
  }

  publishRef.current = publish

  const unpublish = async () => {
    try {
      const saved = await unpublishPiece(id)
      live.current = false
      setLive.current(false)
      change(saved)
    } catch (err) { setError.current(err.message) }
  }

  /* Stop autosave before the files go, and wait out a save already on the wire.
     Leaving this page flushes the last edit; without this, that flush writes the deleted piece straight back. */
  const remove = async () => {
    if (leaving.current) return
    leaving.current = true
    window.clearTimeout(timer.current)
    queued.current = false
    try {
      while (pending.current) await new Promise((r) => window.setTimeout(r, 20))
      await deletePiece(id)
      clearBackup(id)
      piece.current = null
      window.location.assign('/#/writings')
    } catch (err) {
      leaving.current = false
      setError.current(err.message)
      if (piece.current && !isBlank(piece.current)) persist()
    }
  }

  const note = (message) => setError.current(message || '')
  return { ...view, change, publish, unpublish, remove, note, retry: persist }
}

/* State lives in refs so a save never writes over a newer keystroke. This hook is only the view of those refs. */
function useView(piece, setPiece, status, setStatus, live, setLive, error, setError) {
  const view = useRef({ piece: null, status: 'loading', live: false, error: '' })
  const [, redraw] = useRedraw()
  setPiece.current = (next) => { piece.current = next; view.current = { ...view.current, piece: next }; redraw() }
  setStatus.current = (next) => { status.current = next; view.current = { ...view.current, status: next }; redraw() }
  setLive.current = (next) => { live.current = next; view.current = { ...view.current, live: next }; redraw() }
  setError.current = (next) => { error.current = next; view.current = { ...view.current, error: next }; redraw() }
  return view.current
}

function useRedraw() {
  const set = useRef(null)
  const pair = useState(0)
  set.current = pair[1]
  return [pair[0], () => set.current?.((n) => n + 1)]
}
