import { useRef, useState } from 'react'
import { useNearViewport } from '../../../hooks/useNearViewport'
import BookObject from '../book/BookObject'
import { focusStore, useFocus } from '../focus/focusStore'
import BookView from '../view/BookView'

/* Resting pose when a layout doesn't prescribe one: the book's own turn, a slight look down at its top edge. */
export const restOf = (book) => ({ yaw: (book.shape.ry * Math.PI) / 180, pitch: 0.17 })

/* One book wherever it sits — homepage composition or archive grid. A real button around the CSS book (focus ring, keyboard,
   screen readers all come free) whose rectangle the 3D book is drawn into. Hover/focus lifts it; click opens it in the focused view. */
export default function BookSlot({ book, rest = restOf(book), tier = 'md', style, className = '', caption, note }) {
  const slotRef = useRef(null)
  const boxRef = useRef(null)
  const btnRef = useRef(null)
  const near = useNearViewport(slotRef)
  const [live, setLive] = useState(false)
  const [hover, setHover] = useState(false)
  const focus = useFocus()
  const open = focus.slug === book.slug
  const away = open && focus.ready
  const others = !!focus.slug && !open
  const fill = 0.78 * (book.shape.h / 112)

  const pick = () => focusStore.open(book.slug, btnRef.current, rest)
  const mouseOnly = (on) => (e) => e.pointerType === 'mouse' && setHover(on)

  return (
    <li ref={slotRef} className={`slot ${className}${others ? ' is-others' : ''}${open ? ' is-open' : ''}`} style={style}>
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
        <BookObject ref={boxRef} book={book} live={live} away={away} />
        <BookView elRef={boxRef} book={book} tier={tier} rest={rest} fill={fill} hover={hover && !focus.slug} away={away} faded={others} active={near} onReady={setLive} />
      </button>
      {caption}
      {note}
    </li>
  )
}
