import Arrow from '../../ui/Arrow'
import { books, neighbours } from '../../lib/books'
import { replaceTo } from '../../app/navigation'
import { openBook } from '../../lib/openedBook'

/* Previous / next in shelf order. Stepping replaces the history entry, so "back" always returns to the list you came from. */
function Step({ book, dir }) {
  if (!book) return <span />
  const href = `#/readings/${book.slug}`
  const go = (e) => { e.preventDefault(); openBook(book.slug); replaceTo(href) }

  return (
    <a className={`step is-${dir}`} href={href} onClick={go} rel={dir === 'prev' ? 'prev' : 'next'}>
      <span className="t-meta">{dir === 'prev' ? 'Previous' : 'Next'}</span>
      <span className="step-title">{dir === 'prev' && <Arrow kind="left" />}{book.name}{dir === 'next' && <Arrow />}</span>
    </a>
  )
}

export default function BookSteps({ book }) {
  const { prev, next } = neighbours(book)

  return (
    <nav className="steps" aria-label={`Book ${book.index + 1} of ${books.length}`}>
      <Step book={prev} dir="prev" />
      <Step book={next} dir="next" />
    </nav>
  )
}
