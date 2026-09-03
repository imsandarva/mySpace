import { splitRows, wordCount, wordScatter } from '../../lib/scatter'

export default function IdentityLine({ lines, mode, compact, stagger, wordMs }) {
  const total = wordCount(lines)
  let n = 0

  return (
    <h1
      className={`identity-line is-${mode}`}
      aria-label={lines.join(' ')}
      style={{ '--word-ms': `${wordMs}ms` }}
    >
      {splitRows(lines).map((words) => (
        <span className="identity-row" key={words.join(' ')} aria-hidden>
          {words.map((word, wi) => {
            const i = n++
            const s = wordScatter(i, total, compact)
            return (
              <span key={`${word}-${i}`}>
                <span
                  className="identity-word"
                  style={{
                    '--dx': `${s.x}px`,
                    '--dy': `${s.y}px`,
                    '--rot': `${s.rot}deg`,
                    '--sc': s.scale,
                    '--delay': `${i * stagger}ms`,
                  }}
                >
                  {word}
                </span>
                {wi < words.length - 1 ? ' ' : ''}
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}
