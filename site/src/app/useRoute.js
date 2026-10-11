import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { transition } from '../lib/viewTransition'
import { matchRoute } from './routes'

const read = () => matchRoute(window.location.hash.replace(/^#\/?/, ''))

/* Current route, kept in sync with the URL hash. Every change runs inside a view transition, and
   scroll is handled here: home remembers where you left it, an archive deep link centres its book, the rest start at the top. */
export function useRoute() {
  const [route, setRoute] = useState(read)
  const current = useRef(route)
  const scrolls = useRef(new Map())

  useEffect(() => {
    const onChange = () => {
      const next = read()
      scrolls.current.set(current.current.key, window.scrollY)
      current.current = next
      transition(() => setRoute(next))
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  /* Layout effect: runs inside the transition's flushSync, so the "after" snapshot is already scrolled. */
  useLayoutEffect(() => {
    const anchor = route.params.slug && document.getElementById(`anchor-${route.params.slug}`)
    if (anchor) anchor.scrollIntoView({ block: 'center' })
    else window.scrollTo(0, route.name === 'home' ? scrolls.current.get('home') ?? 0 : 0)
  }, [route])

  return route
}
