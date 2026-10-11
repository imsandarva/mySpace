import { nameIf } from '../../../lib/openedBook'
import BookFront from './BookFront'
import BookSpine from './BookSpine'

/* A hardcover standing on the page, built from three lit faces (front board, spine, page-edge top) in a perspective box:
   real depth with plain CSS — no 3D engine, no images, one composited layer per book.
   Everything is sized in container units, so the same markup is a 150px shelf book or a 400px feature.
   It carries the shared-element name when it is the book last opened (or when `vt` forces one, as on the detail page). */
export default function BookObject({ book, vt }) {
  const { tone, shape, fit } = book
  const vars = { '--w': 76, '--h': shape.h, '--d': shape.d, '--ry0': `${shape.ry}deg`, '--fit': fit }

  return (
    <span className="stage" aria-hidden="true">
      <span className="bk3" data-tone={tone} data-mat={shape.material} data-layout={shape.layout} style={{ ...vars, viewTransitionName: vt ?? nameIf(book.slug) }}>
        <span className="bk3-shadow" />
        <span className="bk3-body">
          <BookFront book={book} />
          <BookSpine book={book} />
          <span className="bk3-top" />
        </span>
      </span>
    </span>
  )
}
