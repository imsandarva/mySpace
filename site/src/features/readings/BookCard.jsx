import BookLink from './book/BookLink'
import BookObject from './book/BookObject'

/* One book on a shelf or in the archive: the object, then the author in readable type.
   The id lets a return from the detail page bring this exact book back into view. */
export default function BookCard({ book }) {
  return (
    <li id={`anchor-${book.slug}`} className="bk-item">
      <BookLink book={book} className="bk">
        <BookObject book={book} />
        <span className="bk-author">{book.author}</span>
      </BookLink>
    </li>
  )
}
