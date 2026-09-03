import { accentVar } from '../../lib/accent'
import AccentBar from './AccentBar'
import BookCopy from './BookCopy'

function bookClass(current) {
  return current ? 'book is-current' : 'book'
}

export default function BookEntry({ title, author, accent, current }) {
  return (
    <li className={bookClass(current)} style={{ '--book-accent': accentVar(accent) }} aria-current={current || undefined}>
      <AccentBar />
      <BookCopy title={title} author={author} current={current} />
    </li>
  )
}
