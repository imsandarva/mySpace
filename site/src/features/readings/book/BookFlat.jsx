/* The honest fallback for devices without WebGL: a flat typographic cover with the book's true title and author.
   It is never shown alongside the 3D book — only instead of it. */
export default function BookFlat({ book }) {
  return (
    <span className="flat" data-tone={book.tone} style={{ '--fit': book.fit }} aria-hidden="true">
      <span className="flat-title">{book.name}</span>
      <span className="flat-author">{book.author}</span>
    </span>
  )
}
