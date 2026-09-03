import { books } from '../../data/books'
import BookEntry from './BookEntry'
import Panel from './Panel'

export default function Reading() {
  return (
    <Panel id="reading" label="Readings">
      <ul className="book-list">
        {books.map((b, i) => <BookEntry key={`${b.title}-${i}`} {...b} />)}
      </ul>
    </Panel>
  )
}
