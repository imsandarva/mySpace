import { books } from '../../data/books'
import { arrangeBooks } from '../arrange'
import BookLine from '../shelf/BookLine'
import CurrentBook from '../shelf/CurrentBook'
import ArchiveSheet from './ArchiveSheet'

/* Continuous list: the shelf has no year or date to group on. The live book stays first. */
export default function ReadingsArchive({ entered, onClose }) {
  const { current, rest, total } = arrangeBooks(books)
  return (
    <ArchiveSheet title="Readings" count={total} entered={entered} onClose={onClose}>
      {current && <CurrentBook title={current.title} author={current.author} ruled={rest.length > 0} />}
      <ul className="m-books">
        {rest.map((book, index) => <BookLine key={`${book.title}-${index}`} title={book.title} author={book.author} />)}
      </ul>
    </ArchiveSheet>
  )
}
