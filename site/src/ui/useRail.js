import { useEffect, useRef, useState } from 'react'
import { reducedMotion } from '../lib/viewTransition'

/* Drives a native scroll-snap rail: which edges are reachable (IntersectionObserver, no scroll listener)
   and a `step` that pages it by most of a viewport. */
export function useRail() {
  const scroller = useRef(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const el = scroller.current
    if (!el?.firstElementChild) return undefined
    const [first, last] = [el.firstElementChild, el.lastElementChild]
    const io = new IntersectionObserver((entries) => {
      setEdge((prev) => entries.reduce((next, e) => (e.target === first ? { ...next, start: e.isIntersecting } : e.target === last ? { ...next, end: e.isIntersecting } : next), prev))
    }, { root: el, threshold: 0.95 })
    io.observe(first); io.observe(last)
    return () => io.disconnect()
  }, [])

  const step = (dir) => scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.8, behavior: reducedMotion() ? 'auto' : 'smooth' })

  return { scroller, edge, step }
}
