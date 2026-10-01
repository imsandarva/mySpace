import { useEffect, useRef, useState } from 'react'
import CurrentlyRing from '../../components/shelf/CurrentlyRing'
import { currentlyShouldDraw, markCurrentlyDrawn } from '../currentlyDraw'

/* The one accent on the phone: the word sits on the left edge, and the ring draws once. */
export default function MobileCurrently() {
  const [draw] = useState(currentlyShouldDraw)
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!draw || !node) return
    const done = () => markCurrentlyDrawn()
    node.addEventListener('animationend', done)
    return () => node.removeEventListener('animationend', done)
  }, [draw])

  return (
    <span ref={ref} className={`m-current-mark${draw ? ' is-draw' : ' is-still'}`}>
      <CurrentlyRing ringClass="m-ring" strokeClass="m-ring-stroke" />
      <span className="m-current-word">Currently</span>
    </span>
  )
}
