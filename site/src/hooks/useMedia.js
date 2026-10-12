import { useSyncExternalStore } from 'react'

/* Reactive media query: `useMedia('(max-width: 719px)')`. */
export function useMedia(query) {
  const subscribe = (cb) => { const mq = window.matchMedia(query); mq.addEventListener('change', cb); return () => mq.removeEventListener('change', cb) }
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}
