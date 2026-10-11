import { useLayoutEffect } from 'react'
import Arrow from '../../ui/Arrow'
import ReadingsPage from './ReadingsPage'
import BookObject from './book/BookObject'
import BookSteps from './BookSteps'
import { cameFromInside } from '../../app/navigation'
import { bookBySlug, books } from '../../lib/books'
import { bookName, openBook } from '../../lib/openedBook'

/* One book on its own page: the object keeps its identity from the shelf, the text is calm and editorial.
   Only what the data really holds is shown — full title, author, and whether I'm reading it now. */
export default function BookPage({ route }) {
  const book = bookBySlug(route.params.slug)
  useLayoutEffect(() => { if (book) openBook(book.slug) }, [book])
  if (!book) return <ReadingsPage />

  return (
    <article className="detail wrap" aria-labelledby="book-title">
      <BackToShelf />
      <div className="detail-grid">
        <div className="detail-stage"><BookObject book={book} vt={bookName(book.slug)} /></div>
        <div className="detail-copy">
          {book.current && <p className="now-flag"><i className="dot" aria-hidden="true" />Currently reading</p>}
          <h1 id="book-title" className="t-detail">{book.name}</h1>
          {book.sub && <p className="detail-sub">{book.sub}</p>}
          <p className="detail-author">{book.author}</p>
          <p className="t-meta detail-count">{book.index + 1} of {books.length}</p>
          <BookSteps book={book} />
        </div>
      </div>
    </article>
  )
}

/* Back to the list you came from: real history when you arrived from inside the site (restores scroll, reverses the morph);
   a plain link to the shelf when the page was opened directly. */
function BackToShelf() {
  const onClick = (e) => { if (cameFromInside()) { e.preventDefault(); window.history.back() } }
  return <a className="back" href="#/readings" onClick={onClick}><Arrow kind="left" />All books</a>
}
