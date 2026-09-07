import CurrentlyRing from './CurrentlyRing'

/* Active-shelf signal — rose ink, circled by hand. */

export default function BookCurrently() {
  return (
    <span className="book-currently" aria-label="Currently reading">
      <CurrentlyRing />
      <span className="book-currently-text">Currently</span>
    </span>
  )
}
