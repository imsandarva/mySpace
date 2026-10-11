import BookLink from './book/BookLink'
import BookObject from './book/BookObject'
import CurrentlyReading from './CurrentlyReading'

/* The book in my hands: the largest object on the page, set beside its title — presence from scale and placement, not a badge. */
export default function CurrentBook({ book }) {
  return (
    <article className="now">
      <BookLink book={book} className="now-book"><BookObject book={book} /></BookLink>
      <div className="now-copy">
        <CurrentlyReading />
        <h3 className="t-title">{book.name}</h3>
        {book.sub && <p className="now-sub">{book.sub}</p>}
        <p className="now-author">{book.author}</p>
      </div>
    </article>
  )
}
