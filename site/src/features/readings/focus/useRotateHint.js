import { useEffect, useRef } from 'react'
import { ROTATE_HINT_DELAY_MS, playRotateHint, prefersReducedRotateHint } from './rotateHint'

const RIG_RETRY_MS = 50

/* One auto wiggle 500 ms after focus opens; skips if the visitor already turned the book or prefers reduced motion.
   `invalidateFor` is read from a ref so a late engine load (common on a phone) does not restart this effect and cancel the dance. */
export function useRotateHint({ rigRef, active, touched, invalidateFor }) {
  const played = useRef(false)
  const touchedRef = useRef(touched)
  const invalidateRef = useRef(invalidateFor)
  touchedRef.current = touched
  invalidateRef.current = invalidateFor
  useEffect(() => {
    if (!active || played.current || prefersReducedRotateHint()) return undefined
    let cancelDance, retryId
    const fire = () => {
      if (played.current || touchedRef.current) return
      const rig = rigRef.current
      if (!rig) { retryId = setTimeout(fire, RIG_RETRY_MS); return }
      played.current = true
      cancelDance = playRotateHint(rig, invalidateRef.current)
    }
    const delayId = setTimeout(fire, ROTATE_HINT_DELAY_MS)
    return () => { clearTimeout(delayId); clearTimeout(retryId); cancelDance?.() }
  }, [active, rigRef])
}
