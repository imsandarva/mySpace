import { useEffect, useState } from 'react'
import Arrow from '../../ui/Arrow'
import SettingsMenu from './SettingsMenu'
import { hint } from './platform'

const LABEL = { dirty: 'Unsaved changes', saving: 'Saving…', saved: 'Saved', error: 'Not saved' }

/* A hairline appears under the bar only once the page has scrolled beneath it. */
const useScrolled = () => {
  const [scrolled, set] = useState(false)
  useEffect(() => {
    const read = () => set((was) => (window.scrollY > 6) === was ? was : !was)
    read()
    window.addEventListener('scroll', read, { passive: true })
    return () => window.removeEventListener('scroll', read)
  }, [])
  return scrolled
}

/* Where you are, whether the words reached disk, and the one thing to do next. Everything else lives in Settings. */
export default function WriteBar({ status, adding, live, settings, onPublish }) {
  const scrolled = useScrolled()
  const publishing = status === 'publishing'
  const label = adding ? 'Adding image…' : LABEL[status] || ''
  const state = adding ? 'saving' : status

  return (
    <header className={`write-bar${scrolled ? ' is-scrolled' : ''}`}>
      <a className="write-back" href="#/writings" aria-label="Back to writings"><Arrow kind="left" /><span>Writings</span></a>
      <span className="write-status" data-state={state} role="status" aria-live="polite">{label}</span>
      <div className="write-tools">
        <SettingsMenu {...settings} />
        <button type="button" className="write-publish" aria-busy={publishing} disabled={publishing} title={hint(live ? 'Update' : 'Publish', 'Enter')} onClick={onPublish}>
          {publishing ? (live ? 'Updating…' : 'Publishing…') : (live ? 'Update' : 'Publish')}
        </button>
      </div>
    </header>
  )
}
