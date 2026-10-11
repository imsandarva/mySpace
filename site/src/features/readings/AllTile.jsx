import Arrow from '../../ui/Arrow'

/* The last stop on the rail — same footprint as a cover, so the way to the full shelf reads as part of the shelf. */
export default function AllTile({ count }) {
  return (
    <li className="bk-item">
      <a className="bk is-link bk-all" href="#/readings" aria-label={`All ${count} books`}>
        <span className="cover all-plate">
          <span className="all-inner">
            <span className="all-count">{count}</span>
            <span className="all-label">All books<Arrow /></span>
          </span>
        </span>
      </a>
    </li>
  )
}
