/* Publication date above each writing title. */
export default function WritingMeta({ writing, short = false }) {
  const label = short ? writing.date.replace(/, \d{4}$/, '') : writing.date
  return (
    <span className="t-meta wr-meta">
      <time dateTime={writing.published}>{label}</time>
    </span>
  )
}
