/* The spine: title reading top to bottom, author beneath, as printed on a real hardcover. */
export default function BookSpine({ book }) {
  return (
    <span className="bk3-spine">
      <span className="sp-title">{book.name}</span>
      <span className="sp-author">{book.author}</span>
    </span>
  )
}
