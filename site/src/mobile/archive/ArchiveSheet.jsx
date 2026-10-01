import { useEffect, useRef, useState } from 'react'

function BackChevron() {
  return (
    <svg className="m-back-icon" viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M14.25 5.75 8 12l6.25 6.25" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* Full-screen list. The large title settles into the bar as the page scrolls, the way a native stack does. */
export default function ArchiveSheet({ title, count, entered, onClose, children }) {
  const scroller = useRef(null)
  const heading = useRef(null)
  const [lift, setLift] = useState(0)

  useEffect(() => {
    const prev = document.title
    document.title = `${title} — Sandarva`
    return () => { document.title = prev }
  }, [title])

  useEffect(() => {
    if (!entered) return
    const timer = setTimeout(() => heading.current?.focus({ preventScroll: true }), 340)
    return () => clearTimeout(timer)
  }, [entered])

  useEffect(() => {
    const node = scroller.current
    if (!node) return
    let frame = 0
    const read = () => { frame = 0; const y = node.scrollTop; setLift(Math.min(1, Math.max(0, (y - 6) / 40))) }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read) }
    node.addEventListener('scroll', onScroll, { passive: true })
    return () => { node.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [title])

  return (
    <div ref={scroller} className={`m-archive${entered ? ' is-in' : ''}`} style={{ '--lift': lift }} role="region" aria-label={title}>
      <header className="m-bar">
        <div className="m-bar-row">
          <button type="button" className="m-back" onClick={onClose} aria-label="Back"><BackChevron /></button>
          <span className="m-bar-title" aria-hidden="true">{title}</span>
          <span aria-hidden />
        </div>
      </header>
      <div className="m-archive-body">
        <h1 ref={heading} tabIndex={-1} className="m-display" aria-label={`${title}, ${count}`}>{title}<span className="m-display-count" aria-hidden="true">{count}</span></h1>
        {children}
      </div>
    </div>
  )
}
