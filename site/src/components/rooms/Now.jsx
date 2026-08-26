import { now } from '../../data/identity'
import { useInView } from '../../hooks/useInView'

/* Whispered aside — visually belongs to About, not a headline of its own. */
export default function Now() {
  const [ref, shown] = useInView()
  return (
    <aside ref={ref} className={`room-now${shown ? ' is-in' : ''}`} aria-label="Now">
      <p>{now}</p>
    </aside>
  )
}
