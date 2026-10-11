function outside(url) {
  return { href: url, target: '_blank', rel: 'noopener noreferrer' }
}

/* One writing, two bodies: a shelf card, or the thumbnail-left row it grows into. */
export default function WritingFace({ piece, index, expanded }) {
  const media = piece.thumb
    ? <img src={piece.thumb} alt="" decoding="async" draggable="false" loading={index > 1 ? 'lazy' : 'eager'} />
    : null

  if (expanded) {
    return (
      <li data-flip>
        <a className={`m-write${piece.thumb ? ' has-thumb' : ' is-text'}`} {...outside(piece.url)}>
          {piece.thumb && <span className="m-thumb">{media}</span>}
          <span className="m-write-copy">
            <span className="m-meta"><time dateTime={piece.published}>{piece.date}</time></span>
            <span className="m-write-title">{piece.title}</span>
            {piece.subtitle && <span className="m-write-sub">{piece.subtitle}</span>}
          </span>
          <span className="m-sr">Opens in a new tab.</span>
        </a>
      </li>
    )
  }

  return (
    <li data-flip data-focus>
      <a className="m-card" {...outside(piece.url)}>
        <span className="m-card-face">
          <span className="m-card-media">{media}</span>
          <span className="m-card-copy">
            <time className="m-card-date" dateTime={piece.published}>{piece.date}</time>
            <span className="m-card-title">{piece.title}</span>
            {piece.subtitle && <span className="m-card-sub">{piece.subtitle}</span>}
          </span>
        </span>
        <span className="m-sr">Opens in a new tab.</span>
      </a>
    </li>
  )
}
