import { useInView } from '../../hooks/useInView'

/* Room wrapper: one fade/rise on enter, then still. */
export default function Room({ id, className = '', label, children }) {
  const [ref, shown] = useInView()
  return (
    <section id={id} ref={ref} className={`room ${className}${shown ? ' is-in' : ''}`} aria-label={label}>
      {label && <p className="room-label">{label}</p>}
      {children}
    </section>
  )
}
