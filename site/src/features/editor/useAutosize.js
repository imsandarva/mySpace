import { useLayoutEffect } from 'react'

/* A textarea that is exactly as tall as its words — title, subtitle, caption. Measured before paint, so it never flashes a scrollbar. */
export const fit = (el) => { if (!el) return; el.style.height = '0px'; el.style.height = `${el.scrollHeight}px` }

export const useAutosize = (ref, value) => useLayoutEffect(() => { fit(ref.current) }, [ref, value])
