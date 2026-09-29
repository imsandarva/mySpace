import { useEffect } from 'react'
import { bindShelfToneUnlock, playShelfDop, setShelfHovering } from '../lib/shelfTone'

const ENTRY = '.shelf-entry'

function bindHover() {
  let current = null

  const onOver = (e) => {
    const entry = e.target instanceof Element ? e.target.closest(ENTRY) : null
    if (!entry || entry === current) return
    current = entry
    setShelfHovering(true)
    playShelfDop()
  }

  const onOut = (e) => {
    if (!current) return
    const next = e.relatedTarget instanceof Element ? e.relatedTarget.closest(ENTRY) : null
    if (next === current || current.contains(e.relatedTarget)) return
    current = null
    setShelfHovering(false)
  }

  document.addEventListener('mouseover', onOver)
  document.addEventListener('mouseout', onOut)
  return () => {
    document.removeEventListener('mouseover', onOver)
    document.removeEventListener('mouseout', onOut)
    setShelfHovering(false)
  }
}

/* Hover plays immediately when the browser allows; a real gesture flushes if you are already on an item. */
export function useShelfHoverTone() {
  useEffect(() => {
    bindShelfToneUnlock()
    return bindHover()
  }, [])
}
