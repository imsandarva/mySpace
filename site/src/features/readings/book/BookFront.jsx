/* The front board. Real cover art wins whenever the data has `cover`;
   otherwise a restrained typographic cover that carries only the book's true title and author. */
export default function BookFront({ book }) {
  const { cover, name, author } = book

  return (
    <span className="bk3-front">
      {cover
        ? <img src={cover} alt="" loading="lazy" decoding="async" />
        : (
          <span className="cvr">
            <span className="cvr-title">{name}</span>
            <span className="cvr-author">{author}</span>
          </span>
        )}
    </span>
  )
}
