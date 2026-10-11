import { accentVar } from '../../lib/accent'
import { bookKey } from './bookKey'
import MobileCurrently from './MobileCurrently'

/* One book, two bodies: a packed spine, or the accent-bar row it grows into. */
export default function BookFace({ book, index, expanded, open, tab, onToggle, onFocus }) {
  const tone = { '--book-accent': accentVar(book.accent) }

  if (expanded) {
    return (
      <li data-flip className={`m-book${book.current ? ' is-current' : ''}`} style={tone} aria-current={book.current || undefined}>
        <span className="m-book-bar" aria-hidden="true" />
        <div className="m-book-copy">
          <span className="m-book-title">{book.title}</span>
          {book.current && <MobileCurrently />}
          <span className="m-book-author">{book.author}</span>
        </div>
      </li>
    )
  }

  const label = book.current ? `${book.title}, currently reading, ${book.author}` : `${book.title}, ${book.author}`
  return (
    <li data-flip>
      <button
        type="button"
        className={`m-spine${book.current ? ' is-live' : ''}${open ? ' is-on' : ''}`}
        style={tone}
        tabIndex={tab}
        aria-expanded={open}
        aria-controls="m-spine-panel"
        aria-label={label}
        onClick={() => onToggle(bookKey(book.title, index))}
        onFocus={onFocus}
      >
        <span className="m-spine-title" aria-hidden="true">{book.title}</span>
      </button>
    </li>
  )
}
