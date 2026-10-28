import { FloatingMenu } from '@tiptap/react/menus'
import { useEffect, useRef, useState } from 'react'
import { useMedia } from '../../hooks/useMedia'
import Icon from './icons'
import { on } from './platform'

/* An empty top-level paragraph is the one place the "+" belongs. */
export const atEmptyLine = (state) => {
  const { $anchor } = state.selection
  return $anchor.depth === 1 && $anchor.parent.type.name === 'paragraph' && $anchor.parent.content.size === 0
}

/* What can be inserted. `run` receives the editor and the image picker. Kept short on purpose. */
const ITEMS = [
  { key: 'image', icon: 'image', label: 'Image', hint: 'Photo with a caption', run: (_ed, pick) => pick() },
  { key: 'heading', icon: 'heading', label: 'Heading', hint: 'A new section', run: (ed) => ed.chain().focus().setHeading({ level: 2 }).run() },
  { key: 'quote', icon: 'quote', label: 'Quote', hint: 'Set a passage apart', run: (ed) => ed.chain().focus().setBlockquote().run() },
  { key: 'list', icon: 'list', label: 'Bulleted list', hint: 'One thing after another', run: (ed) => ed.chain().focus().toggleBulletList().run() },
  { key: 'ordered', icon: 'ordered', label: 'Numbered list', hint: 'In order', run: (ed) => ed.chain().focus().toggleOrderedList().run() },
]

/* The quiet "+" at the start of an empty line, and the menu it opens. "/" opens the same menu from the keyboard.
   The menu is a listbox the caret never leaves: arrows move, Enter chooses, Esc closes, typing anything closes. */
export default function InsertControl({ editor, onPickImage }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const roomy = useMedia('(min-width: 860px)')
  const openRef = useRef(false)
  openRef.current = open

  const close = () => { setOpen(false); setActive(0) }
  const choose = (item) => { close(); item.run(editor, onPickImage) }

  useEffect(() => on('write:insert', () => { setActive(0); setOpen(true) }), [])

  /* The menu belongs to one empty line: leaving it, or typing, dismisses it. */
  useEffect(() => {
    const check = () => { if (openRef.current && !atEmptyLine(editor.state)) close() }
    editor.on('transaction', check)
    editor.on('blur', check)
    return () => { editor.off('transaction', check); editor.off('blur', check) }
  }, [editor])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      const step = { ArrowDown: 1, ArrowUp: -1 }[e.key]
      if (step) { e.preventDefault(); e.stopPropagation(); setActive((i) => (i + step + ITEMS.length) % ITEMS.length) }
      else if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); choose(ITEMS[active]) }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close() }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, active])

  /* Wide screens: the "+" hangs in the left margin. Narrow: it sits at the right end of the empty line, out of the text's way. */
  const options = roomy
    ? { placement: 'left', offset: 16, flip: false, shift: { padding: 8 } }
    : { placement: 'right', flip: false, shift: { padding: 8 }, offset: ({ rects }) => ({ mainAxis: editor.view.dom.getBoundingClientRect().right - rects.reference.x - rects.floating.width }) }

  const stop = (e) => e.preventDefault() // keep the caret where it is

  return (
    <FloatingMenu editor={editor} options={options} shouldShow={({ state, view }) => view.hasFocus() && state.selection.empty && atEmptyLine(state)}>
      <div className={`ins${open ? ' is-open' : ''}${roomy ? '' : ' is-end'}`}>
        <button type="button" className="ins-plus" aria-label="Add to the piece" aria-expanded={open} aria-haspopup="listbox" title="Add (/)" onMouseDown={stop} onClick={() => { setActive(0); setOpen((v) => !v) }}>
          <Icon name="plus" size={15} />
        </button>
        {open && (
          <ul className="pop ins-pop" role="listbox" aria-label="Add" aria-activedescendant={`ins-${ITEMS[active].key}`}>
            {ITEMS.map((item, i) => (
              <li key={item.key} id={`ins-${item.key}`} role="option" aria-selected={i === active} className={i === active ? 'is-active' : ''} onMouseDown={stop} onMouseEnter={() => setActive(i)} onClick={() => choose(item)}>
                <span className="ins-icon"><Icon name={item.icon} /></span>
                <span className="ins-text"><b>{item.label}</b><small>{item.hint}</small></span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </FloatingMenu>
  )
}
