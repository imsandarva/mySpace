function Chevron() {
  return (
    <svg className="m-chevron" viewBox="0 0 16 16" aria-hidden focusable="false">
      <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* Label, hairline, and the quiet count that opens the full list. Hidden when the preview is the whole list. */
export default function ShelfHead({ id, label, count, showAll, onOpen }) {
  return (
    <div className={`m-head${showAll ? '' : ' is-end'}`}>
      <h2 id={id} className="m-label">{label}</h2>
      <span className="m-rule" aria-hidden />
      {showAll && (
        <button type="button" className="m-all" onClick={onOpen} aria-label={`All ${count} ${label.toLowerCase()}`}>
          All {count}<Chevron />
        </button>
      )}
    </div>
  )
}
