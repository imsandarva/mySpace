/* Date and destination, always together — a writing opens on Substack and says so before you tap. */
export default function WritingMeta({ writing, short = false }) {
  const label = short ? writing.date.replace(/, \d{4}$/, '') : writing.date
  return (
    <span className="t-meta wr-meta">
      <time dateTime={writing.published}>{label}</time>
      <span aria-hidden="true">·</span>
      <span>Substack</span>
    </span>
  )
}
