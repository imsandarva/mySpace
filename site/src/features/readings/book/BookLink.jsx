import { openBook } from '../../../lib/openedBook'

/* Every book that opens a detail page goes through here: it names the clicked book for the transition, then lets the link navigate. */
export default function BookLink({ book, className = '', children }) {
  const onClick = (e) => openBook(book.slug, e.currentTarget.querySelector('.bk3'))

  return (
    <a className={`is-link ${className}`} href={`#/readings/${book.slug}`} aria-label={`${book.title}, ${book.author}${book.current ? '. Currently reading' : ''}`} onClick={onClick}>
      {children}
    </a>
  )
}
