import { useCallback, useEffect, useRef, useState } from 'react'
import { runMorph } from './morph'

const NAMES = new Set(['writings', 'readings'])

export function readArchive() {
  const id = window.location.hash.replace(/^#\/?/, '')
  return NAMES.has(id) ? id : null
}

/* Hash history so the system back control closes the list and plays the morph in reverse. */
export function useArchive() {
  const initial = readArchive()
  const [name, setName] = useState(initial)
  const nameRef = useRef(name)
  const returnTo = useRef(null)
  nameRef.current = name

  const go = useCallback((next) => {
    runMorph(() => setName(next), next || nameRef.current)
  }, [])

  const close = useCallback(() => {
    if (!nameRef.current) return
    if (history.state?.archive) history.back()
    else go(null)
  }, [go])

  const open = useCallback((id) => {
    if (!NAMES.has(id) || nameRef.current) return
    returnTo.current = document.activeElement
    history.pushState({ archive: id }, '', `#/${id}`)
    go(id)
  }, [go])

  useEffect(() => {
    const onPop = () => go(readArchive())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [go])

  useEffect(() => {
    if (name) return
    const el = returnTo.current
    returnTo.current = null
    const timer = setTimeout(() => el?.focus?.({ preventScroll: true }), 340)
    return () => clearTimeout(timer)
  }, [name])

  useEffect(() => {
    if (!name) return
    const onKey = (event) => { if (event.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [name, close])

  useEffect(() => {
    if (!name) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [name])

  return { name, open, close }
}
