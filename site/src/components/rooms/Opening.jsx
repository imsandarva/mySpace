import { identity } from '../../data/identity'
import { useCursorProximity } from '../../hooks/useCursorProximity'
import { useInView } from '../../hooks/useInView'
import { useRef } from 'react'

export default function Opening() {
  const [sectionRef, shown] = useInView({ threshold: 0.2, rootMargin: '0px', initial: true })
  const lineRef = useRef(null)
  useCursorProximity(sectionRef, lineRef)

  return (
    <section id="opening" ref={sectionRef} className={`room room-opening${shown ? ' is-in' : ''}`}>
      <h1 ref={lineRef} className="identity-line">
        {identity.line.map((row) => <span key={row} className="identity-row">{row}</span>)}
      </h1>
      <p className="identity-support">{identity.support}</p>
      <span className="identity-mark" aria-hidden />
    </section>
  )
}
