import { useEffect } from 'react'

const EASE = 0.08
const MAX_X = 14
const MAX_Y = 9

/* Signature interaction: the identity line lazily follows the cursor — discovered, never announced. */
export function useCursorProximity(sectionRef, targetRef) {
  useEffect(() => {
    const section = sectionRef.current
    const target = targetRef.current
    if (!section || !target) return
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return

    let mx = 0, my = 0, cx = 0, cy = 0, raf = 0, tracking = false

    const tick = () => {
      cx += (mx - cx) * EASE
      cy += (my - cy) * EASE
      target.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      if (tracking || Math.abs(mx - cx) > 0.08 || Math.abs(my - cy) > 0.08) raf = requestAnimationFrame(tick)
      else raf = 0
    }

    const start = () => { if (!raf) raf = requestAnimationFrame(tick) }

    const onMove = (e) => {
      const r = section.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
      mx = nx * MAX_X
      my = ny * MAX_Y
      tracking = true
      start()
    }

    const onLeave = () => { mx = 0; my = 0; tracking = false; start() }

    section.addEventListener('pointermove', onMove, { passive: true })
    section.addEventListener('pointerleave', onLeave)
    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [sectionRef, targetRef])
}
