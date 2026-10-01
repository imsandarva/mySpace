import { useCallback, useEffect, useRef, useState } from 'react'

const NAMES = new Set(['writings', 'readings'])
const LEAVE = 360
const LEAVE_STILL = 160

export function readArchive() {
  const id = window.location.hash.replace(/^#\/?/, '')
  return NAMES.has(id) ? id : null
}

function reduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* Hash history so the system back control closes the list and restores the front door. */
export function useArchive() {
  const initial = readArchive()
  const [name, setName] = useState(initial)
  const [phase, setPhase] = useState(initial ? 'open' : 'idle')
  const phaseRef = useRef(phase)
  const returnTo = useRef(null)
  phaseRef.current = phase

  const close = useCallback(() => {
    if (phaseRef.current === 'idle' || phaseRef.current === 'closing') return
    if (history.state?.archive) history.back()
    else {
      history.replaceState(null, '', `${location.pathname}${location.search}`)
      setPhase('closing')
    }
  }, [])

  const open = useCallback((id) => {
    if (!NAMES.has(id) || phaseRef.current !== 'idle') return
    returnTo.current = document.activeElement
    history.pushState({ archive: id }, '', `#/${id}`)
    setName(id)
    setPhase('opening')
  }, [])

  useEffect(() => {
    if (phase !== 'opening') return
    let second = 0
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setPhase((now) => (now === 'opening' ? 'open' : now))) })
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second) }
  }, [phase])

  useEffect(() => {
    const onPop = () => {
      const next = readArchive()
      if (next) { setName(next); setPhase('open'); return }
      setPhase((now) => (now === 'idle' ? now : 'closing'))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (phase !== 'closing') return
    const timer = setTimeout(() => { setName(null); setPhase('idle') }, reduced() ? LEAVE_STILL : LEAVE)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'idle') return
    const el = returnTo.current
    returnTo.current = null
    el?.focus?.()
  }, [phase])

  useEffect(() => {
    if (phase === 'idle') return
    const onKey = (event) => { if (event.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, close])

  return { name, visible: phase !== 'idle', entered: phase === 'open', open, close }
}
