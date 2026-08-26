import Room from '../ui/Room'
import { books } from '../../data/books'

export default function Books() {
  return (
    <Room id="books" className="room-books" label="Reading">
      <ul className="book-shelf">
        {books.map((b) => (
          <li key={b.title} className="book-entry">
            <span className="book-title">{b.title}</span>
            <span className="book-author">{b.author}</span>
          </li>
        ))}
      </ul>
    </Room>
  )
}
