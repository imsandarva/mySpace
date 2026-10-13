import { useRef } from 'react'
import { useNearViewport } from './useNearViewport'

/* Near the viewport, a shelf book stays built. While a focus session is open, a transient observer miss
   (overlay, scroll lock) must not dispose it — that rebuild is the "collection refreshes" flash on the way home. */
export function useShelfPresence(ref, session) {
  const near = useNearViewport(ref)
  const kept = useRef(false)
  if (near) kept.current = true
  else if (!session) kept.current = false
  return near || kept.current
}
