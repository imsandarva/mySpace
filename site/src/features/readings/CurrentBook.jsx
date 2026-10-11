import Cover from '../../ui/Cover'
import { sharedName } from '../../lib/books'

/* The book in my hands right now — given the largest cover on the page and a quiet, honest label. */
export default function CurrentBook({ book }) {
  return (
    <article className="now">
      <a className="now-cover" href={`#/readings/${book.slug}`} aria-label={`${book.title}, ${book.author}. Currently reading`}>
        <Cover book={book} vt={sharedName(book.slug)} />
      </a>
      <div className="now-copy">
        <p className="now-flag"><i className="dot" aria-hidden="true" />Currently reading</p>
        <h3 className="t-title">{book.name}</h3>
        {book.sub && <p className="now-sub">{book.sub}</p>}
        <p className="now-author">{book.author}</p>
      </div>
    </article>
  )
}
