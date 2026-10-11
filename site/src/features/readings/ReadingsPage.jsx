import PageHead from '../../ui/PageHead'
import { books } from '../../lib/books'
import BookCard from './BookCard'

/* The complete shelf: the same objects as the homepage, calmer, in a grid you can scan. Opening one carries it to its own page. */
export default function ReadingsPage() {
  return (
    <>
      <PageHead title="Readings" count={books.length} vt="readings-title" />
      <section className="wrap archive" aria-label="All books">
        <ul className="book-grid" role="list">
          {books.map((b) => <BookCard key={b.slug} book={b} />)}
        </ul>
      </section>
    </>
  )
}
