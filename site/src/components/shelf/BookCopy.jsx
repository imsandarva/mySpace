import BookCurrently from './BookCurrently'

/* Title and author — the verbal body of one book. */

export default function BookCopy({ title, author, current }) {
  return (
    <div className="book-copy">
      <span className="book-title">{title}</span>
      {current && <BookCurrently />}
      <span className="book-author">{author}</span>
    </div>
  )
}
