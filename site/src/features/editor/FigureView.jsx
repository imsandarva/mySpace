import { NodeViewWrapper } from '@tiptap/react'
import { useContext, useRef, useState } from 'react'
import { FIGURE_SIZES } from '../../lib/post/markup'
import FigureWidth from './FigureWidth'
import { MediaBase } from './media'
import { useAutosize } from './useAutosize'

const withBase = (base, srcset) => String(srcset || '').split(',').map((part) => {
  const [url, desc] = part.trim().split(/\s+/)
  return url ? `${base}${url}${desc ? ` ${desc}` : ''}` : ''
}).filter(Boolean).join(', ')

const stop = (e) => e.stopPropagation() // typing in a field must not reach the editor

/* The figure, as a writer sees it: the same image and caption a reader gets. Its tools (alt text, remove) exist only
   while it is selected, hovered or has focus, and float over the image, so nothing around it ever moves. */
export default function FigureView({ node, updateAttributes, selected, deleteNode, editor, getPos }) {
  const base = useContext(MediaBase)
  const { src, srcset, width, height, alt, caption, layout } = node.attrs
  const wide = layout === 'wide'
  const [altOpen, setAltOpen] = useState(false)
  const cap = useRef(null)
  useAutosize(cap, caption)

  /* Enter in the caption goes back to writing, on the line after the figure (the editor always keeps one). */
  const onCaptionKey = (e) => {
    stop(e)
    if (e.key === 'Enter') { e.preventDefault(); editor.commands.focus(getPos() + node.nodeSize + 1) }
    if (e.key === 'Escape') { e.preventDefault(); editor.commands.setNodeSelection(getPos()) }
  }
  const onAltKey = (e) => { stop(e); if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); setAltOpen(false) } }

  return (
    <NodeViewWrapper as="figure" className={`fig${wide ? ' is-wide' : ''}${selected ? ' is-selected' : ''}${caption ? ' has-caption' : ''}`}>
      <div className="fig-frame" data-drag-handle>
        <img src={`${base}${src}`} srcSet={withBase(base, srcset) || undefined} sizes={FIGURE_SIZES[wide ? 'wide' : 'column']} alt={alt || ''} width={width || undefined} height={height || undefined} draggable="false" />
        <div className="fig-tools" onMouseDown={stop}>
          <FigureWidth wide={wide} onToggle={() => updateAttributes({ layout: wide ? 'column' : 'wide' })} />
          <span className="fig-sep" aria-hidden="true" />
          <button type="button" className={alt ? 'has-alt' : ''} aria-expanded={altOpen} title="Describe the image for someone who can’t see it" onClick={() => setAltOpen((v) => !v)}>{alt ? 'Alt ✓' : 'Alt'}</button>
          <button type="button" onClick={deleteNode}>Remove</button>
        </div>
        {altOpen && (
          <div className="fig-alt" onMouseDown={stop}>
            <input autoFocus value={alt || ''} placeholder="Describe this image for someone who can’t see it" aria-label="Alt text" onChange={(e) => updateAttributes({ alt: e.target.value })} onKeyDown={onAltKey} />
            <button type="button" onClick={() => setAltOpen(false)}>Done</button>
          </div>
        )}
      </div>
      <figcaption>
        <div>
          <textarea ref={cap} className="fig-caption" rows={1} value={caption || ''} placeholder="Add a caption" aria-label="Caption" onChange={(e) => updateAttributes({ caption: e.target.value })} onMouseDown={stop} onKeyDown={onCaptionKey} />
        </div>
      </figcaption>
    </NodeViewWrapper>
  )
}
