/* Under the book: a quiet hint that it turns, and a discreet way back to the three-quarter view. */
export default function FocusTools({ onReset, touched }) {
  return (
    <div className="fl-tools">
      <span className={`t-meta fl-hint${touched ? ' is-done' : ''}`}>Drag to rotate</span>
      <button type="button" className="fl-reset" onClick={onReset} aria-label="Reset view" title="Reset view">
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v3h3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  )
}
