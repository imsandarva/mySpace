import Arrow from '../../ui/Arrow'

/* The last stop on the shelf — a quiet typographic colophon that opens the whole collection. */
export default function AllTile({ count }) {
  return (
    <li className="bk-item bk-end">
      <a className="bk-all" href="#/readings" aria-label={`All ${count} books`}>
        <span className="all-count">{count}</span>
        <span className="all-label">All books<Arrow /></span>
      </a>
    </li>
  )
}
