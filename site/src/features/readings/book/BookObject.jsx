import { forwardRef } from 'react'
import BookFront from './BookFront'
import BookSpine from './BookSpine'

/* The CSS book: the placeholder while the 3D layer loads, the permanent book where WebGL isn't available, and a stand-in
   for anyone who prefers less. It also is the tracked box the 3D book is drawn into, so layout never shifts.
   `live` hides it (the real 3D book is drawing); `away` hides it instantly (the book is open in the focused view). */
const BookObject = forwardRef(function BookObject({ book, live = false, away = false }, ref) {
  const { tone, shape, fit } = book
  const vars = { '--w': 76, '--h': shape.h, '--d': shape.d, '--ry0': `${shape.ry}deg`, '--fit': fit }

  return (
    <span ref={ref} className={`stage${live ? ' is-live' : ''}${away ? ' is-away' : ''}`} aria-hidden="true">
      <span className="bk3" data-tone={tone} data-mat={shape.material} data-layout={shape.layout} style={vars}>
        <span className="bk3-shadow" />
        <span className="bk3-body">
          <BookFront book={book} />
          <BookSpine book={book} />
          <span className="bk3-top" />
        </span>
      </span>
    </span>
  )
})

export default BookObject
