import Arrow from './Arrow'

/* A homepage section title with its count, and the one clear way into the full collection.
   `vt` names the title so it can travel into the matching archive page. */
export default function SectionHead({ id, title, count, href, more, vt }) {
  return (
    <header className="section-head">
      <h2 id={id} className="t-section">
        <span style={{ viewTransitionName: vt }}>{title}</span>
        <sup className="count">{count}</sup>
      </h2>
      <a className="more" href={href}>{more}<Arrow /></a>
    </header>
  )
}
