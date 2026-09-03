import { bookMarkStrokes } from '../../lib/bookIdentity'

export default function BookMark({ title }) {
  return (
    <svg className="book-mark" viewBox="0 0 16 10" aria-hidden="true">
      {bookMarkStrokes(title).map((stroke, i) => (
        <line key={i} x1={stroke.x1} y1={stroke.y1} x2={stroke.x2} y2={stroke.y2} />
      ))}
    </svg>
  )
}
