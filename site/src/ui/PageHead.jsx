import Arrow from './Arrow'

/* Top of an archive page: the way back, then the same title that was a section on the homepage, larger. */
export default function PageHead({ title, count, vt }) {
  return (
    <header className="page-head wrap">
      <a className="back" href="#/"><Arrow kind="left" />Home</a>
      <h1 className="t-display">
        <span style={{ viewTransitionName: vt }}>{title}</span>
        <sup className="count">{count}</sup>
      </h1>
    </header>
  )
}
