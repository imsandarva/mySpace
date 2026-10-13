import { books } from '../../../lib/books'
import BookSlot from './BookSlot'

/* Every book, compact. Covers are painted ahead of the visit and every slot stays mounted, so the grid does not fill in after the page opens. */
export default function ArchiveGrid({ inert }) {
  return (
    <ul className="book-grid" role="list" inert={inert ? '' : undefined}>
      {books.map((b) => <BookSlot key={b.slug} book={b} tier="sm" persist reveal={false} caption={<span className="bk-author">{b.author}</span>} />)}
    </ul>
  )
}
