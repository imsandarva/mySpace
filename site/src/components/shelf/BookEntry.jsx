export default function BookEntry({ title, author, current }) {
  return (
    <li className={current ? 'book is-current' : 'book'} aria-current={current || undefined}>
      <span className="book-head">
        <span className="book-title">{title}</span>
        {current && <span className="book-now">now</span>}
      </span>
      <span className="book-author">{author}</span>
    </li>
  )
}
