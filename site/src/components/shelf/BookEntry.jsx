import { spineColorForTitle } from '../../lib/bookIdentity'
import BookMark from './BookMark'

export default function BookEntry({ title, author, current }) {
  const spine = current ? 'var(--clay)' : spineColorForTitle(title)

  return (
    <li className={current ? 'book is-current' : 'book'} aria-current={current || undefined} style={{ '--spine': spine }}>
      <span className="book-spine" aria-hidden="true" />
      <span className="book-copy">
        <BookMark title={title} />
        <span className="book-head">
          <span className="book-title">{title}</span>
          {current && <span className="book-now">now</span>}
        </span>
        <span className="book-author">{author}</span>
      </span>
    </li>
  )
}
