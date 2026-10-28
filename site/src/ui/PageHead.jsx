import Arrow from './Arrow'

/* Top of an archive page: the way back, then the same title that was a section on the homepage, larger.
   `tools` sits opposite the back link. Omit it and the row is only that link — no empty slot. */
export default function PageHead({ title, count, vt, tools = null, back = { href: '#/', label: 'Home' }, heading = 't-display', snug = false }) {
  return (
    <header className={`page-head wrap${snug ? ' is-snug' : ''}`}>
      <div className="page-nav">
        <a className="back" href={back.href}><Arrow kind="left" />{back.label}</a>
        {tools ? <div className="page-tools">{tools}</div> : null}
      </div>
      <h1 className={heading}>
        <span style={{ viewTransitionName: vt }}>{title}</span>
        {count != null && <sup className="count">{count}</sup>}
      </h1>
    </header>
  )
}
