import { useEffect, useRef, useState } from 'react'

/* One observer per element; fires once so rooms settle and stay. */
export function useInView({ threshold = 0.16, rootMargin = '0px 0px -10% 0px', initial = false } = {}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(initial)

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setShown(true)
      io.disconnect()
    }, { threshold, rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [shown, threshold, rootMargin])

  return [ref, shown]
}
