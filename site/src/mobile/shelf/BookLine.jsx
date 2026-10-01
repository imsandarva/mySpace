export default function BookLine({ title, author }) {
  return (
    <li className="m-book">
      <span className="m-book-title">{title}</span>
      <span className="m-book-author">{author}</span>
    </li>
  )
}
