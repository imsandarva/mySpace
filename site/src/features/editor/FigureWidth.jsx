const keep = (e) => { e.preventDefault(); e.stopPropagation() }

/* One control: full width on desktop (breaks out of the text column), column again on a second click. */
export default function FigureWidth({ wide, onToggle }) {
  return (
    <button type="button" className="fig-width" aria-pressed={wide} title={wide ? 'Back to the width of the text' : 'Past the text, nearly the width of the screen. On a phone it stays with the text.'} onMouseDown={keep} onClick={(e) => { keep(e); onToggle() }}>
      Full width
    </button>
  )
}
