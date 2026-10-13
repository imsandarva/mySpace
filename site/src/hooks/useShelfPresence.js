import { useRef } from 'react'
import { useNearViewport } from './useNearViewport'

/* Once a book has been near the viewport it stays built for the life of the page.
   Disposing it when it scrolls away, then creating it again on the way back, is the "refresh" flash. */
export function useShelfPresence(ref) {
  const near = useNearViewport(ref, '1200px')
  const kept = useRef(false)
  if (near) kept.current = true
  return kept.current
}
