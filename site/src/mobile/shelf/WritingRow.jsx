/* Text always starts on the page edge. A thumb, when there is one, sits on the right and never indents the copy. */
export default function WritingRow({ title, subtitle, date, published, url, thumb }) {
  return (
    <a className={`m-write${thumb ? ' has-thumb' : ''}`} href={url} target="_blank" rel="noopener noreferrer">
      <span className="m-write-copy">
        <span className="m-meta">
          <time dateTime={published}>{date}</time>
          <span className="m-dot" aria-hidden>·</span>
          <span>Substack</span>
        </span>
        <span className="m-write-title">{title}</span>
        <span className="m-write-sub">{subtitle}</span>
      </span>
      {thumb && (
        <span className="m-thumb">
          <img src={thumb} alt="" width="72" height="72" decoding="async" />
        </span>
      )}
      <span className="m-sr">Opens in a new tab.</span>
    </a>
  )
}
