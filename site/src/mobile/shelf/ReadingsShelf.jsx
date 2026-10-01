import { books } from '../../data/books'
import { READING_PREVIEW, arrangeBooks } from '../arrange'
import BookLine from './BookLine'
import CurrentBook from './CurrentBook'
import ShelfHead from './ShelfHead'

/* Quieter than writings: the live book, then two recent ones. The rest lives one tap away. */
export default function ReadingsShelf({ onOpen }) {
  const { current, rest, total } = arrangeBooks(books)
  const recent = rest.slice(0, READING_PREVIEW)
  return (
    <section className="m-shelf m-rise d2" aria-labelledby="m-readings">
      <ShelfHead id="m-readings" label="Readings" count={total} showAll={rest.length > recent.length} onOpen={onOpen} />
      {current && <CurrentBook title={current.title} author={current.author} ruled={recent.length > 0} />}
      {recent.length > 0 && (
        <ul className="m-books">
          {recent.map((book, index) => <BookLine key={`${book.title}-${index}`} title={book.title} author={book.author} />)}
        </ul>
      )}
    </section>
  )
}
