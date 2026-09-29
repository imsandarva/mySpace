import { useEffect, useState } from 'react'

function readHash() {
  return window.location.hash.replace(/^#\/?/, '')
}

export function useHashRoute() {
  const [route, setRoute] = useState(readHash)
  useEffect(() => {
    const onChange = () => setRoute(readHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
