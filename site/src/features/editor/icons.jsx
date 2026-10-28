/* One stroke family for the writing desk (16px grid, 1.5 stroke, round caps) — the same hand as ui/Arrow. */
const PATHS = {
  bold: 'M4.5 2.75h3.9a2.4 2.4 0 0 1 0 4.8H4.5zM4.5 7.55h4.4a2.45 2.45 0 0 1 0 4.9H4.5z',
  italic: 'M6.5 2.75h5M4.5 13.25h5M9.6 2.75l-3.2 10.5',
  link: 'M6.9 9.1a2.5 2.5 0 0 0 3.5 0l2.2-2.2a2.5 2.5 0 0 0-3.5-3.5l-.7.7M9.1 6.9a2.5 2.5 0 0 0-3.5 0L3.4 9.1a2.5 2.5 0 0 0 3.5 3.5l.7-.7',
  heading: 'M3.75 2.75v10.5M12.25 2.75v10.5M3.75 8h8.5',
  quote: 'M3 3v10M6.5 5h6.5M6.5 8h6.5M6.5 11h4',
  list: 'M6.5 4h7M6.5 8h7M6.5 12h7M2.75 4h.01M2.75 8h.01M2.75 12h.01',
  ordered: 'M6.5 4h7M6.5 8h7M6.5 12h7M2.6 3.1l1-.5v3M2.5 9.5c.2-.7 1.9-.7 1.9.3 0 .7-1.4 1.2-1.9 2h2',
  image: 'M3.5 2.75h9A1.25 1.25 0 0 1 13.75 4v8a1.25 1.25 0 0 1-1.25 1.25h-9A1.25 1.25 0 0 1 2.25 12V4A1.25 1.25 0 0 1 3.5 2.75zM2.5 11l3.5-3 2.5 2 2-1.5 3 2.5M5.6 6.1h.01',
  plus: 'M8 3v10M3 8h10',
  tune: 'M2.5 5h5.5M12 5h1.5M2.5 11h1.5M8 11h5.5M10 3.4v3.2M6 9.4v3.2',
}

export default function Icon({ name, size = 16 }) {
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
