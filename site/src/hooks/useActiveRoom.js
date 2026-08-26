import { useEffect, useState } from 'react'

/* Tracks which museum room occupies the viewport — drives the quiet wayfinder. */
export function useActiveRoom(ids, fallback = ids[0]) {
  const [active, setActive] = useState(fallback)

  useEffect(() => {
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!nodes.length) return

    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]) setActive(visible[0].target.id)
    }, { threshold: [0.25, 0.5, 0.7], rootMargin: '-18% 0px -40% 0px' })
    nodes.forEach((n) => io.observe(n))

    const onScrollEnd = () => {
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atEnd) setActive(ids[ids.length - 1])
    }
    window.addEventListener('scroll', onScrollEnd, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', onScrollEnd) }
  }, [ids])

  return active
}
