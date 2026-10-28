import { lazy, Suspense } from 'react'
import PageHead from '../../ui/PageHead'
import { writings, writingsByYear } from '../../lib/writings'
import WritingItem from './WritingItem'

/* The buttons are their own chunk, and only in dev, so a production visit never asks for them. */
const AuthorBar = import.meta.env.DEV ? lazy(() => import('./AuthorBar.jsx')) : null

/* Every writing, grouped by year — the year is a marginal numeral, the rows are the same family as the homepage list. */
export default function WritingsPage() {
  return (
    <>
      <PageHead
        title="Writings"
        count={writings.length}
        vt="writings-title"
        tools={AuthorBar ? <Suspense fallback={null}><AuthorBar /></Suspense> : null}
      />
      <div className="wrap archive">
        {writingsByYear.map(([year, items]) => (
          <section key={year} className="year" aria-labelledby={`y-${year}`}>
            <h2 id={`y-${year}`} className="year-label">{year}</h2>
            <ul className="year-list" role="list">
              {items.map((w) => <li key={w.slug}><WritingItem writing={w} large /></li>)}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
