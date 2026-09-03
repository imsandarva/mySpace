export default function WritingEntry({ title, subtitle, date, published, url, thumb }) {
  return (
    <a
      className={`writing${thumb ? '' : ' is-text-only'}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title}, ${date}, on Substack`}
    >
      {thumb && (
        <span className="writing-thumb">
          <img src={thumb} alt="" width="200" height="160" decoding="async" />
        </span>
      )}
      <span className="writing-copy">
        <time className="writing-date" dateTime={published}>{date}</time>
        <span className="writing-head">
          <span className="writing-title">{title}</span>
          <span className="writing-exit" aria-hidden>↗</span>
        </span>
        <span className="writing-sub">{subtitle}</span>
      </span>
    </a>
  )
}
