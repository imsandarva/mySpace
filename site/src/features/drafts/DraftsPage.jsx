import { useEffect, useState } from 'react'
import Arrow from '../../ui/Arrow'
import PageHead from '../../ui/PageHead'
import Pill from '../../ui/Pill'
import { listDrafts } from '../editor/api'
import '../../styles/drafts.css'

const when = (iso) => {
  const d = new Date(iso || '')
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

/* The drafts list the route and the stylesheet already expect. Dev only — App imports this behind `import.meta.env.DEV`. */
export default function DraftsPage() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancel = false
    listDrafts()
      .then((list) => { if (!cancel) setRows(list) })
      .catch((err) => { if (!cancel) setError(err.message || 'Couldn’t open drafts.') })
    return () => { cancel = true }
  }, [])

  return (
    <>
      <PageHead title="Drafts" count={rows?.length} vt="drafts-title" snug back={{ href: '#/writings', label: 'Writings' }} tools={<Pill href="#/write" tone="primary">+ Write</Pill>} />
      <div className="wrap archive">
        {error && (
          <div className="draft-error" role="alert">
            <p className="draft-error-title">Couldn’t open drafts</p>
            <p className="draft-status">{error}</p>
          </div>
        )}
        {rows && !rows.length && !error && (
          <div className="draft-empty">
            <p className="draft-empty-title">No drafts yet</p>
            <Pill href="#/write" tone="primary">+ Write</Pill>
          </div>
        )}
        {!!rows?.length && (
          <ul className="draft-list">
            {rows.map((row) => (
              <li key={row.id}>
                <a className="draft-row" href={`#/write/${row.id}`}>
                  <span className="draft-copy">
                    <span className={`t-title draft-title${row.title ? '' : ' is-untitled'}`}>{row.title || 'Untitled'}<Arrow /></span>
                    {row.excerpt ? <span className="t-small draft-excerpt">{row.excerpt}</span> : null}
                  </span>
                  <p className="draft-side t-meta">
                    {row.words ? <span>{row.words === 1 ? '1 word' : `${row.words} words`}</span> : null}
                    {when(row.updatedAt) ? <time dateTime={row.updatedAt}>{when(row.updatedAt)}</time> : null}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
