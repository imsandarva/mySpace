import { useEffect, useState } from 'react'

/* Drag (mouse, pen or touch) and arrow keys turn the focused book.
   Listeners are on the window, capture, not passive: on a phone the full-screen canvas and the
   scrolling page otherwise take the finger, so pointerdown on the stage never becomes a drag.
   `touch-action: none` on the stage is the same request to the browser; preventDefault is the backup. */
const STEP = 0.2
const hit = (el, e) => {
  const r = el?.getBoundingClientRect()
  return !!r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
}

export function useRotate(rigRef, elRef) {
  const [dragging, setDragging] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    const el = elRef.current
    if (!el) return undefined
    let start = null
    const down = (e) => {
      if (!e.isPrimary || e.button > 0 || !rigRef.current || !hit(el, e)) return
      e.preventDefault()
      start = [e.clientX, e.clientY]
      setDragging(true); setTouched(true)
    }
    const move = (e) => {
      if (!start || !rigRef.current) return
      e.preventDefault()
      rigRef.current.rotateBy(e.clientX - start[0], e.clientY - start[1])
      start = [e.clientX, e.clientY]
    }
    const up = (e) => { if (!e.isPrimary) return; start = null; setDragging(false) }
    const blockScroll = (e) => { if (start) e.preventDefault() }
    const opts = { capture: true, passive: false }
    window.addEventListener('pointerdown', down, opts)
    window.addEventListener('pointermove', move, opts)
    window.addEventListener('pointerup', up, { capture: true })
    window.addEventListener('pointercancel', up, { capture: true })
    window.addEventListener('touchmove', blockScroll, opts)
    return () => {
      window.removeEventListener('pointerdown', down, opts)
      window.removeEventListener('pointermove', move, opts)
      window.removeEventListener('pointerup', up, { capture: true })
      window.removeEventListener('pointercancel', up, { capture: true })
      window.removeEventListener('touchmove', blockScroll, opts)
    }
  }, [rigRef, elRef])

  const onKeyDown = (e) => {
    const k = { ArrowLeft: [-STEP, 0], ArrowRight: [STEP, 0], ArrowUp: [0, -STEP], ArrowDown: [0, STEP] }[e.key]
    if (!k || !rigRef.current) return
    e.preventDefault(); rigRef.current.nudge(...k); setTouched(true)
  }

  return { dragging, touched, handlers: { onKeyDown } }
}
