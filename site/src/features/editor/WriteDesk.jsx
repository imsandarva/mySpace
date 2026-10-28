import '../../styles/editor.css'
import '../../styles/editor-menus.css'
import '../../styles/editor-figure.css'
import Sheet from './Sheet'
import { usePiece } from './usePiece'

/* Opens one piece. Nothing is written to disk until there is something to keep. */
export default function WriteDesk({ id }) {
  const { piece, status, live, error, change, publish, unpublish, remove, note, retry } = usePiece(id)
  if (!piece) {
    return (
      <div className="write">
        <p className="write-opening">{error || 'Opening…'}</p>
        {error && <a className="back write-opening-back" href="#/writings">Writings</a>}
      </div>
    )
  }
  return (
    <div className="write">
      <Sheet id={id} piece={piece} status={status} live={live} error={error} onChange={change} onPublish={publish} onUnpublish={unpublish} onDelete={remove} onError={note} onRetry={retry} />
    </div>
  )
}
