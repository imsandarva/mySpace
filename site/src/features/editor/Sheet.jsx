import { useEffect, useRef, useState } from 'react'
import DateField from './DateField'
import Editor from './Editor'
import Notice from './Notice'
import { useAutosize } from './useAutosize'
import WriteBar from './WriteBar'

const hasFiles = (e) => [...e.dataTransfer.types].includes('Files')

/* Title and the line under it are fields; the date is quiet metadata; the body is the document. All of it wears the reading page's type. */
export default function Sheet({ id, piece, status, live, error, onChange, onPublish, onUnpublish, onDelete, onError, onRetry }) {
  const title = useRef(null)
  const dek = useRef(null)
  const focus = useRef(null)
  const insert = useRef(null)
  const file = useRef(null)
  const [dropping, setDropping] = useState(false)
  const [adding, setAdding] = useState(false)

  useAutosize(title, piece.title)
  useAutosize(dek, piece.subtitle)
  useEffect(() => { if (!piece.title && !piece.subtitle) title.current?.focus() }, [])

  /* Enter walks down the page: title → line beneath → body. Backspace on the empty line walks back up. */
  const toDek = (e) => { if (e.key === 'Enter') { e.preventDefault(); dek.current?.focus() } }
  const toBody = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); focus.current?.() }
    if (e.key === 'Backspace' && !piece.subtitle) { e.preventDefault(); const t = title.current; t?.focus(); t?.setSelectionRange(t.value.length, t.value.length) }
  }

  /* Publishing needs a title; say so and put the caret there. */
  const publish = () => {
    if (!piece.title.trim()) { title.current?.focus(); onError('Give it a title to publish.'); return }
    onPublish()
  }

  return (
    <>
      <WriteBar
        status={status}
        adding={adding}
        live={live}
        onPublish={publish}
        settings={{ id, piece, live, onError, onUnpublish, onDelete, onPreview: (preview) => onChange({ preview }), onClear: () => onChange({ preview: null }) }}
      />
      <div
        className={`write-sheet${dropping ? ' is-dropping' : ''}`}
        onDragOver={(e) => { if (hasFiles(e)) { e.preventDefault(); setDropping(true) } }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDropping(false) }}
        onDrop={() => setDropping(false)}
      >
        <textarea ref={title} className="write-title" rows={1} value={piece.title} placeholder="Untitled" aria-label="Title" spellCheck onChange={(e) => onChange({ title: e.target.value.replace(/\n/g, ' ') })} onKeyDown={toDek} />
        <textarea ref={dek} className="write-dek" rows={1} value={piece.subtitle} placeholder="Add a subtitle" aria-label="Subtitle" spellCheck onChange={(e) => onChange({ subtitle: e.target.value.replace(/\n/g, ' ') })} onKeyDown={toBody} />
        <p className="piece-meta"><DateField value={piece.published} onChange={(published) => onChange({ published })} /></p>
        <Editor id={id} doc={piece.doc} onChange={(doc) => onChange({ doc })} onError={onError} onBusy={setAdding} insertRef={insert} focusRef={focus} onPickImage={() => file.current?.click()} />
        <input ref={file} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden onChange={(e) => { insert.current?.([...e.target.files]); e.target.value = '' }} />
      </div>
      <Notice message={error} onRetry={status === 'error' ? onRetry : null} onDismiss={() => onError('')} />
    </>
  )
}
