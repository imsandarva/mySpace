/* One arrow family for the whole site: same stroke, same weight, four directions. */
const PATHS = {
  right: 'M3 8h10M9 4l4 4-4 4',
  left: 'M13 8H3M7 4 3 8l4 4',
  out: 'M5 11l6-6M6 5h5v5',
  up: 'M8 13V3M4 7l4-4 4 4',
}

export default function Arrow({ kind = 'right' }) {
  return (
    <svg className={`arrow is-${kind}`} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={PATHS[kind]} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
