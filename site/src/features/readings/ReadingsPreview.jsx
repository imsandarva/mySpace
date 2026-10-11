import Rail from '../../ui/Rail'
import SectionHead from '../../ui/SectionHead'
import { books, currentBook, railBooks } from '../../lib/books'
import AllTile from './AllTile'
import BookCard from './BookCard'
import CurrentBook from './CurrentBook'

/* Homepage Readings: the current book on its own stage, a browsable rail of the rest, one clear door to all of them. */
export default function ReadingsPreview() {
  return (
    <section className="section section-readings" aria-labelledby="readings-title">
      <div className="wrap">
        <SectionHead id="readings-title" title="Readings" count={books.length} href="#/readings" more={`All ${books.length} books`} vt="readings-title" />
        <div className={`shelf${currentBook ? '' : ' no-current'}`}>
          {currentBook && <CurrentBook book={currentBook} />}
          <Rail label="More from the shelf">
            {railBooks.map((b) => <BookCard key={b.slug} book={b} linked />)}
            <AllTile count={books.length} />
          </Rail>
        </div>
      </div>
    </section>
  )
}
