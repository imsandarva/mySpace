/* A book cover. Real artwork wins when the data has `cover`; otherwise a typographic plate in the book's tone.
   Sizing is container-relative (cqw), so the same markup is a 140px rail cover or a 400px feature. */
export default function Cover({ book, vt }) {
  const { cover, name, tone, fit, variant, current } = book

  return (
    <span className={`cover${cover ? ' has-art' : ''}`} data-tone={tone} data-variant={variant} style={{ '--fit': fit, viewTransitionName: vt }} aria-hidden="true">
      {cover
        ? <img src={cover} alt="" loading="lazy" decoding="async" />
        : <span className="cover-title">{name}</span>}
      {current && <i className="cover-live" />}
    </span>
  )
}
