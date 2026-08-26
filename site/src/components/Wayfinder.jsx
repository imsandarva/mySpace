import { rooms } from '../data/identity'
import { useActiveRoom } from '../hooks/useActiveRoom'

const IDS = rooms.map((r) => r.id)

export default function Wayfinder() {
  const active = useActiveRoom(IDS)

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <nav className="wayfinder" aria-label="Sections">
      {rooms.map(({ id, numeral }) => (
        <button
          key={id}
          type="button"
          className={`wayfinder-item${active === id ? ' is-active' : ''}`}
          onClick={() => go(id)}
          aria-current={active === id ? 'true' : undefined}
          aria-label={id}
        >
          {numeral}
        </button>
      ))}
    </nav>
  )
}
