import { useEffect, useState } from 'react'

/* True while the element is within `margin` of the viewport (generous, so books are ready before they scroll into view) — used to build 3D books only for the part of a long list that is
   actually around, and to release them when it is far away. */
export function useNearViewport(ref, margin = '600px') {
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
  return near
}
