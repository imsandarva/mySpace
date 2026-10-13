import BookSlot from './collection/BookSlot'
import CurrentlyReading from './CurrentlyReading'

/* The book in hand: largest object on the shelf, set beside its title. The "Currently" ring is the only badge. */
export default function CurrentBook({ book }) {
  return (
    <article className="now">
      <BookSlot as="div" book={book} tier="lg" className="now-book" />
      <div className="now-copy">
        <CurrentlyReading />
        <h3 className="t-title">{book.name}</h3>
        {book.sub && <p className="now-sub">{book.sub}</p>}
        <p className="now-author">{book.author}</p>
      </div>
    </article>
  )
}
