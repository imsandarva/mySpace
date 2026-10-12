/* The words beside the book: title strongest, subtitle and author quieter. Only what the data holds — no invented notes. */
export default function FocusDetails({ book, headingRef }) {
  return (
    <div className="fl-copy">
      {book.current && <p className="now-flag"><i className="dot" aria-hidden="true" />Currently reading</p>}
      <h2 id="fl-title" ref={headingRef} tabIndex={-1} className="t-detail">{book.name}</h2>
      {book.sub && <p className="detail-sub">{book.sub}</p>}
      <p className="detail-author">{book.author}</p>
    </div>
  )
}
