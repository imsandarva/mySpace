import { useEffect, useRef, useState } from 'react'
import { buildPins, sweepPinSiblings } from '../lib/pinit'

const MIN = 130
const PAD = 24

export function useBoardWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(720)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let timer = 0
    const measure = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setWidth(Math.max(MIN, Math.floor(el.clientWidth - PAD))), 160)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => { window.clearTimeout(timer); ro.disconnect() }
  }, [])

  return { ref, width }
}

export function usePinterestEmbed(deps) {
  const host = useRef(null)

  useEffect(() => {
    const node = host.current
    let alive = true
    buildPins().catch(() => {})
    return () => { if (alive) sweepPinSiblings(node); alive = false }
  }, deps)

  return host
}
