import PageHead from '../../ui/PageHead'
import { books } from '../../lib/books'
import BookCard from './BookCard'

/* The complete shelf: the same covers as the homepage, in a grid. A deep link (#/readings/slug) lands on, and marks, one book. */
export default function ReadingsPage({ route }) {
  return (
    <>
      <PageHead title="Readings" count={books.length} vt="readings-title" />
      <section className="wrap archive" aria-label="All books">
        <ul className="book-grid" role="list">
          {books.map((b) => <BookCard key={b.slug} book={b} detail target={b.slug === route.params.slug} />)}
        </ul>
      </section>
    </>
  )
}
