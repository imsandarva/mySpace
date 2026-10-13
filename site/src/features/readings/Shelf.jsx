import Rail from '../../ui/Rail'
import { books, currentBook, railBooks } from '../../lib/books'
import AllTile from './AllTile'
import BookSlot from './collection/BookSlot'
import CurrentBook from './CurrentBook'

/* Homepage shelf: the current book on its own stage, then a browsable rail of the rest. Click opens the focused view; the rail itself does not spin. */
export default function Shelf({ inert }) {
  return (
    <div className={`shelf${currentBook ? '' : ' no-current'}`} inert={inert ? '' : undefined}>
      {currentBook && <CurrentBook book={currentBook} />}
      <Rail label="More from the shelf">
        {railBooks.map((b) => <BookSlot key={b.slug} book={b} tier="sm" className="bk-item" persist reveal={false} caption={<span className="bk-author">{b.author}</span>} />)}
        <AllTile count={books.length} />
      </Rail>
    </div>
  )
}
