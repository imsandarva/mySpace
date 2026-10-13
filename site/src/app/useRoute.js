import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { readingsReady } from '../features/readings/view/engineStore'
import { transition } from '../lib/viewTransition'
import { matchRoute } from './routes'
import { applyScroll, shouldSave } from './scroll'

const read = () => matchRoute(window.location.hash.replace(/^#\/?/, ''))

/* Current route, kept in sync with the URL hash. Every change runs inside a view transition;
   scroll policy lives in ./scroll.js and is applied in a layout effect so the "after" snapshot is already positioned. */
export function useRoute() {
  const [route, setRoute] = useState(read)
  const latest = useRef(route)
  const saved = useRef(new Map())

  useEffect(() => {
    const onChange = () => {
      const next = read()
      if (shouldSave(latest.current)) saved.current.set(latest.current.key, window.scrollY)
      latest.current = next
      /* The archive waits until its covers are painted, so the new page arrives with its books — not an empty grid that then fills in. */
      transition(async () => {
        if (next.name === 'readings') await readingsReady()
        flushSync(() => setRoute(next))
      })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  useLayoutEffect(() => {
    applyScroll(route, saved.current)
  }, [route])

  return route
}
