import { books } from '../../../lib/books'
import BookSlot from './BookSlot'

/* Every book, compact: the same 3D objects in a grid you can scan, each with its author beneath in readable type.
   Books are built only while near the viewport, so the page stays light however long the shelf grows. */
export default function ArchiveGrid({ inert }) {
  return (
    <ul className="book-grid" role="list" inert={inert ? '' : undefined}>
      {books.map((b) => <BookSlot key={b.slug} book={b} tier="sm" caption={<span className="bk-author">{b.author}</span>} />)}
    </ul>
  )
}
