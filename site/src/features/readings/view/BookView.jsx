import { useEffect, useRef } from 'react'
import { useBookEngine } from './engineStore'

/* First opaque background colour above the element — what the page actually looks like behind the book. */
function pageColor(el) {
  for (let n = el; n; n = n.parentElement) {
    const c = getComputedStyle(n).backgroundColor
    if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c
  }
  return '#f8f5ef'
}

/* Puts one 3D book into a DOM element: while mounted (and `active`), the shared canvas draws a book into `elRef`'s rectangle.
   Renders nothing itself. Props steer the rig; `onRig` hands the rig up (for dragging); `onReady` fires once it is drawing.
   `from` is the pose to be created in when it should then glide to `rest` (a book picked up from the shelf).
   A new book rises out of the page colour (`reveal`), so it never pops in. `away` hides the book instantly (its focused twin has
   taken over); `faded` fades it out/in (other books while one is open). */
export default function BookView({ elRef, book, tier = 'md', mode = 'rest', rest, from, fill, hover = false, away = false, faded = false, reveal = true, active = true, onRig, onReady }) {
  const { api } = useBookEngine()
  const rigRef = useRef(null)
  const latest = useRef({})
  latest.current = { rest, from, fill, hover, away, faded, reveal, onRig, onReady }

  useEffect(() => {
    if (!api || !active || !elRef.current) return undefined
    let dead = false
    let remove
    api.createBookRig({ book, tier, mode, rest: latest.current.from ?? latest.current.rest, fill: latest.current.fill }).catch(() => null).then((rig) => {
      if (!rig) return undefined
      if (dead) return rig.dispose()
      const L = latest.current
      rig.el = elRef.current
      rig.setVeilColor(pageColor(elRef.current))
      rig.setHover(L.hover)
      rig.hidden = L.away
      if (L.from) rig.setRest(L.rest)
      rig.setFade(0, true)
      rig.setFade(L.faded ? 0 : 1, !L.reveal)
      rigRef.current = rig
      remove = api.getEngine().add(rig)
      L.onRig?.(rig)
      L.onReady?.(true)
    })
    return () => {
      dead = true
      remove?.()
      rigRef.current?.dispose()
      rigRef.current = null
      latest.current.onRig?.(null)
      latest.current.onReady?.(false)
    }
  }, [api, active, book.slug, tier, mode, elRef])

  useEffect(() => { rest && rigRef.current?.setRest(rest) }, [rest?.yaw, rest?.pitch])
  useEffect(() => { rigRef.current?.setHover(hover) }, [hover])
  useEffect(() => { const r = rigRef.current; if (r) { r.hidden = away; r.refresh(); r.wake() } }, [away])
  useEffect(() => { rigRef.current?.setFade(faded ? 0 : 1) }, [faded])
  return null
}
