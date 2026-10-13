/* Plain paper behind the focused book: sits above the shelf (and shared canvas) but below focus chrome, so the FLIP reads on a calm field. */
export default function FocusScrim({ inline, closing }) {
  return <div className={`fl-scrim${inline ? ' is-inline' : ''}${closing ? ' is-closing' : ''}`} aria-hidden="true" />
}
