import BookNow from './BookNow'

/* Title and author — the verbal body of one book. */

export default function BookCopy({ title, author, current }) {
  return (
    <div className="book-copy">
      <span className="book-head">
        <span className="book-title">{title}</span>
        {current && <BookNow />}
      </span>
      <span className="book-author">{author}</span>
    </div>
  )
}
