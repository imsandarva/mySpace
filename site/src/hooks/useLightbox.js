import { useCallback, useEffect, useState } from 'react'

export function useLightbox(items) {
  const [index, setIndex] = useState(null)
  const open = useCallback((i) => setIndex(i), [])
  const close = useCallback(() => setIndex(null), [])
  const next = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % items.length)), [items.length])
  const prev = useCallback(() => setIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length)), [items.length])

  useEffect(() => {
    if (index === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('is-lightbox')
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.classList.remove('is-lightbox')
      window.removeEventListener('keydown', onKey)
    }
  }, [index, close, next, prev])

  return { index, item: index === null ? null : items[index], open, close, next, prev }
}
