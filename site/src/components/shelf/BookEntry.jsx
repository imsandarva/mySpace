export default function BookEntry({ title, author }) {
  return (
    <li className="book">
      <span className="book-title">{title}</span>
      <span className="book-author">{author}</span>
    </li>
  )
}
