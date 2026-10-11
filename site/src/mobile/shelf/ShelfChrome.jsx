import { useEffect, useRef, useState } from 'react'

function BackChevron() {
  return (
    <svg className="m-back-icon" viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M14.25 5.75 8 12l6.25 6.25" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* Shared frame: the label is one element, small on the shelf and large once the list fills the screen. */
export default function ShelfChrome({ id, label, count, expanded, locked, onOpen, onClose, children }) {
  const scroller = useRef(null)
  const heading = useRef(null)
  const [lift, setLift] = useState(0)

  useEffect(() => {
    if (!expanded) return
    const prev = document.title
    document.title = `${label} — Sandarva`
    return () => { document.title = prev }
  }, [expanded, label])

  useEffect(() => {
    if (!expanded) return
    const timer = setTimeout(() => heading.current?.focus({ preventScroll: true }), 340)
    return () => clearTimeout(timer)
  }, [expanded])

  useEffect(() => {
    const node = scroller.current
    if (!node || !expanded) return
    let frame = 0
    const read = () => { frame = 0; const y = node.scrollTop; setLift(Math.min(1, Math.max(0, (y - 6) / 40))) }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read) }
    node.addEventListener('scroll', onScroll, { passive: true })
    return () => { node.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [expanded])

  return (
    <div className={`m-slot${id === 'writings' ? ' is-first' : ''}`} data-slot={id} style={expanded ? { height: 'var(--hold)' } : undefined} inert={locked ? '' : undefined} aria-hidden={locked || undefined}>
      <section ref={scroller} data-shelf className={`m-shelf${expanded ? ' is-expanded' : ''}`} style={{ '--lift': expanded ? lift : 0 }} aria-labelledby={`${id}-label`}>
        {expanded && (
          <header className="m-bar">
            <div className="m-bar-row">
              <button type="button" className="m-back" onClick={onClose} aria-label="Back"><BackChevron /></button>
              <span className="m-bar-title" aria-hidden="true">{label}</span>
              <span aria-hidden />
            </div>
          </header>
        )}
        <div className={expanded ? 'm-archive-body' : 'm-shelf-block'}>
          <div className={`m-head${expanded ? ' is-display' : ''}`}>
            <h2 ref={heading} id={`${id}-label`} data-flip="label" tabIndex={expanded ? -1 : undefined} className={expanded ? 'm-display' : 'm-label'}>
              {label}{expanded && <span className="m-display-count">{count}</span>}
            </h2>
            {!expanded && (
              <>
                <span className="m-rule" aria-hidden />
                <button type="button" className="m-all" onClick={onOpen} aria-label={`All ${count} ${label.toLowerCase()}`}>All {count}</button>
              </>
            )}
          </div>
          {children}
        </div>
      </section>
    </div>
  )
}
