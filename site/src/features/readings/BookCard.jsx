import Cover from '../../ui/Cover'
import { sharedName } from '../../lib/books'

/* One book: cover, then author (and, in the archive, the subtitle the cover has no room for).
   `linked` cards lead to that book in the archive; archive cards are plain, so nothing pretends to be a button. */
export default function BookCard({ book, linked = false, detail = false, target = false }) {
  const vt = sharedName(book.slug)
  const body = (
    <>
      <Cover book={book} vt={vt} />
      <span className="bk-copy">
        <span className="bk-author">{book.author}</span>
        {detail && book.sub && <span className="bk-sub">{book.sub}</span>}
      </span>
    </>
  )

  return (
    <li id={detail ? `anchor-${book.slug}` : undefined} className={`bk-item${target ? ' is-target' : ''}`}>
      {linked
        ? <a className="bk is-link" href={`#/readings/${book.slug}`} aria-label={`${book.title}, ${book.author}`}>{body}</a>
        : <div className="bk" title={book.title}>{body}</div>}
    </li>
  )
}
