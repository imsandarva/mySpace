import { useRef } from 'react'
import MobileCurrently from './MobileCurrently'

/* Drops under the shelf. Content stays mounted while the panel closes so the height can ease shut. */
export default function SpinePanel({ book }) {
  const last = useRef(book)
  if (book) last.current = book
  const shown = book || last.current

  return (
    <div className={`m-panel${book ? ' is-open' : ''}`} id="m-spine-panel" role="region" aria-live="polite" aria-hidden={book ? undefined : true}>
      <div className="m-panel-clip">
        {shown && (
          <div className="m-panel-body">
            <p className="m-panel-title">{shown.title}</p>
            {shown.current && <MobileCurrently />}
            <p className="m-panel-author">{shown.author}</p>
          </div>
        )}
      </div>
    </div>
  )
}
