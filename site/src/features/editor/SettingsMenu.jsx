import { useEffect, useRef, useState } from 'react'
import { site } from '../../data/site'
import { firstFigure } from '../../lib/post/figures'
import { excerpt } from '../../lib/post/excerpt'
import { upload } from './api'
import Icon from './icons'

/* The less-used things about a piece, one click away and out of the page: how its link looks when shared, where it lives,
   and the two ways to take it back. Link preview defaults to the first image, then the site image. */
export default function SettingsMenu({ id, piece, live, onPreview, onClear, onUnpublish, onDelete, onError }) {
  const [open, setOpen] = useState(false)
  const [armed, setArmed] = useState(null)
  const [copied, setCopied] = useState(false)
  const root = useRef(null)
  const trigger = useRef(null)
  const file = useRef(null)

  const close = (refocus) => { setOpen(false); setArmed(null); if (refocus) trigger.current?.focus() }

  useEffect(() => {
    if (!open) return
    const away = (e) => { if (!root.current?.contains(e.target)) close(false) }
    const key = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(true) } }
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', key)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', key) }
  }, [open])

  const fig = firstFigure(piece.doc)
  const chosen = piece.preview?.src
  const media = (rel) => `/media/draft/${id}/${rel}`
  const src = chosen ? media(chosen) : fig ? media(fig.src) : '/assets/og-default.webp'
  const origin = chosen ? 'The image you chose.' : fig ? 'The first image in the piece.' : 'The site image — this piece has no image yet.'
  const description = piece.subtitle?.trim() || excerpt(piece.doc, 140) || site.description
  const address = piece.slug ? `${site.url.replace(/^https:\/\//, '')}/writing/${piece.slug}/` : ''

  const ask = (which, run) => { if (armed === which) run(); else setArmed(which) }
  const copy = async () => {
    try { await navigator.clipboard.writeText(`${site.url}/writing/${piece.slug}/`); setCopied(true); window.setTimeout(() => setCopied(false), 1600) } catch { onError?.('Couldn’t copy the address.') }
  }
  const choose = async (e) => {
    const picked = e.target.files?.[0]
    e.target.value = ''
    if (!picked) return
    try {
      const saved = await upload(id, picked, 'preview')
      onPreview({ src: saved.src, width: saved.width, height: saved.height })
    } catch (err) { onError?.(err.message) }
  }

  return (
    <div className="set" ref={root}>
      <button ref={trigger} type="button" className="write-icon" aria-label="Settings" aria-expanded={open} aria-haspopup="dialog" title="Settings" onClick={() => (open ? close(false) : setOpen(true))}>
        <Icon name="tune" size={18} />
      </button>
      {open && (
        <div className="pop set-pop" role="dialog" aria-label="Settings">
          <section>
            <h2 className="set-label">Link preview</h2>
            <div className="set-card">
              <img src={src} alt="" />
              <p className="set-card-title">{piece.title.trim() || 'Untitled'}</p>
              <p className="set-card-text">{description}</p>
            </div>
            <p className="set-note">{origin}</p>
            <div className="set-row">
              <button type="button" className="set-btn" onClick={() => file.current?.click()}>Choose image</button>
              {chosen && <button type="button" className="set-btn is-quiet" onClick={onClear}>Use automatic</button>}
              <input ref={file} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={choose} />
            </div>
          </section>
          <section>
            <h2 className="set-label">Address</h2>
            {address ? (
              <div className="set-address"><span title={address}>{address}</span><button type="button" className="set-btn is-quiet" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button></div>
            ) : <p className="set-note">Chosen from the title when you publish, then it never changes.</p>}
          </section>
          {(live || piece.updatedAt) && (
            <section className="set-danger">
              {live && <button type="button" className={armed === 'unpublish' ? 'is-armed' : ''} onClick={() => ask('unpublish', onUnpublish)}>{armed === 'unpublish' ? 'Confirm: take it off the site' : 'Unpublish'}</button>}
              <button type="button" className={armed === 'delete' ? 'is-armed' : ''} onClick={() => ask('delete', onDelete)}>{armed === 'delete' ? 'Confirm: delete permanently' : 'Delete'}</button>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
