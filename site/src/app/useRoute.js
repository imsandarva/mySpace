import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { transition } from '../lib/viewTransition'
import { markInside } from './navigation'
import { matchRoute } from './routes'
import { applyScroll, shouldSave } from './scroll'

const read = () => matchRoute(window.location.hash.replace(/^#\/?/, ''))

/* Current route, kept in sync with the URL hash. Every change runs inside a view transition;
   scroll policy lives in ./scroll.js and is applied in a layout effect so the "after" snapshot is already positioned. */
export function useRoute() {
  const [route, setRoute] = useState(read)
  const latest = useRef(route)
  const shown = useRef(null)
  const saved = useRef(new Map())

  useEffect(() => {
    const onChange = () => {
      const next = read()
      markInside()
      if (shouldSave(latest.current, next)) saved.current.set(latest.current.key, window.scrollY)
      latest.current = next
      transition(() => setRoute(next))
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  useLayoutEffect(() => {
    applyScroll(route, shown.current, saved.current)
    shown.current = route
  }, [route])

  return route
}
