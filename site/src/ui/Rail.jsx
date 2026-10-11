import Arrow from './Arrow'
import { useRail } from './useRail'

/* A horizontally browsable list: native scroll-snap for touch, labelled paging buttons for pointer users,
   and a soft fade on whichever side still has more — so continuation is visible without needing to know the gesture. */
export default function Rail({ label, children }) {
  const { scroller, edge, step } = useRail()

  return (
    <div className="rail" data-start={edge.start} data-end={edge.end}>
      <div className="rail-bar">
        <p className="t-meta">{label}</p>
        <div className="rail-ctl">
          <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label="Earlier books"><Arrow kind="left" /></button>
          <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label="More books"><Arrow /></button>
        </div>
      </div>
      <ul className="rail-track" ref={scroller} role="list" aria-label={label}>{children}</ul>
    </div>
  )
}
