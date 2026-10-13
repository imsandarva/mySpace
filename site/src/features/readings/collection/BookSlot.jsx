import { useRef, useState } from 'react'
import { useShelfPresence } from '../../../hooks/useShelfPresence'
import BookFlat from '../book/BookFlat'
import { focusStore, useFocus } from '../focus/focusStore'
import { useBookEngine } from '../view/engineStore'
import BookView from '../view/BookView'

/* Resting pose when a layout doesn't prescribe one: the book's own turn, a slight look down at its top edge. */
export const restOf = (book) => ({ yaw: (book.shape.ry * Math.PI) / 180, pitch: 0.17 })

/* One book wherever it sits — homepage composition or archive grid. A real button (focus ring, keyboard,
   screen readers all come free) around the box the 3D book is drawn into. Hover/focus lifts it; click opens it in the focused view. */
export default function BookSlot({ book, rest = restOf(book), tier = 'md', style, className = '', caption, note }) {
  const slotRef = useRef(null)
  const boxRef = useRef(null)
  const btnRef = useRef(null)
  const focus = useFocus()
  const near = useShelfPresence(slotRef, !!focus.slug)
  const [hover, setHover] = useState(false)
  const flat = useBookEngine().status === 'unsupported'
  const [live, setLive] = useState(false)
  const open = focus.slug === book.slug
  const others = !!focus.slug && !open && !focus.closing
  /* Shelf copy hidden for the whole trip (including flight home); neighbours dissolve on canvas but stay built. */
  const away = open && focus.ready
  const fill = 0.78 * (book.shape.h / 112)

  const pick = () => focusStore.open(book.slug, btnRef.current, rest)
  const mouseOnly = (on) => (e) => e.pointerType === 'mouse' && setHover(on)

  return (
    <li ref={slotRef} className={`slot ${className}${others ? ' is-others' : ''}${open ? ' is-open' : ''}${flat || live ? ' is-ready' : ''}`} style={style}>
      <button
        ref={btnRef}
        type="button"
        className="slot-btn"
        aria-label={`${book.title}, ${book.author}${book.current ? '. Currently reading' : ''}. Open`}
        onClick={pick}
        onPointerEnter={mouseOnly(true)}
        onPointerLeave={mouseOnly(false)}
        onFocus={(e) => e.target.matches(':focus-visible') && setHover(true)}
        onBlur={() => setHover(false)}
      >
        <span ref={boxRef} className="slot-box">{flat && <BookFlat book={book} />}</span>
        <BookView elRef={boxRef} book={book} tier={tier} rest={rest} fill={fill} hover={hover && !focus.slug} away={away} faded={others} active={near} onReady={setLive} />
      </button>
      {caption}
      {note}
    </li>
  )
}
