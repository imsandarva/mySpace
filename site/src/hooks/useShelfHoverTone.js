import { useEffect } from 'react'
import { bindShelfToneUnlock, playShelfDop } from '../lib/shelfTone'

const ENTRY = '.shelf-entry'

function bindHover() {
  let current = null

  const onOver = (e) => {
    const entry = e.target instanceof Element ? e.target.closest(ENTRY) : null
    if (!entry || entry === current) return
    current = entry
    playShelfDop()
  }

  const onOut = (e) => {
    if (!current) return
    const next = e.relatedTarget instanceof Element ? e.relatedTarget.closest(ENTRY) : null
    if (next === current || current.contains(e.relatedTarget)) return
    current = null
  }

  document.addEventListener('mouseover', onOver)
  document.addEventListener('mouseout', onOut)
  return () => {
    document.removeEventListener('mouseover', onOver)
    document.removeEventListener('mouseout', onOut)
  }
}

/* Document-level: unlock on gesture, dop on each shelf-entry enter. */
export function useShelfHoverTone() {
  useEffect(() => {
    bindShelfToneUnlock()
    return bindHover()
  }, [])
}
