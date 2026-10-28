import { useEditorState } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import { useEffect, useState } from 'react'
import { tidyHref } from '../../lib/post/schema'
import Icon from './icons'
import { hint, on } from './platform'

const stop = (e) => e.preventDefault() // a click must not steal the selection

/* The formatting that exists — nothing else. `key` is the shortcut shown in the tooltip. */
const MARKS = [
  { icon: 'bold', label: 'Bold', key: 'B', run: (ed) => ed.chain().focus().toggleBold().run() },
  { icon: 'italic', label: 'Italic', key: 'I', run: (ed) => ed.chain().focus().toggleItalic().run() },
]
const BLOCKS = [
  { icon: 'heading', label: 'Heading', run: (ed) => ed.chain().focus().toggleHeading({ level: 2 }).run() },
  { icon: 'quote', label: 'Quote', run: (ed) => ed.chain().focus().toggleBlockquote().run() },
  { icon: 'list', label: 'List', run: (ed) => ed.chain().focus().toggleBulletList().run() },
]

/* Appears beside a selection and nowhere else. Icons, because it sits on top of the words; each has a label for assistive tech. */
export default function BubbleBar({ editor }) {
  const [href, setHref] = useState('')
  const [linking, setLinking] = useState(false)

  /* Re-render only when something the bar shows has changed, not on every keystroke. */
  const state = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({ bold: ed.isActive('bold'), italic: ed.isActive('italic'), link: ed.isActive('link'), heading: ed.isActive('heading', { level: 2 }), quote: ed.isActive('blockquote'), list: ed.isActive('bulletList') }),
  })

  const openLink = () => { setHref(editor.getAttributes('link').href || ''); setLinking(true) }
  useEffect(() => on('write:link', openLink), [editor]) // ⌘/Ctrl K

  const apply = () => {
    const url = tidyHref(href)
    const chain = editor.chain().focus().extendMarkRange('link')
    if (url) chain.setLink({ href: url }).run()
    else chain.unsetLink().run()
    setLinking(false)
  }
  const cancel = () => { setLinking(false); editor.commands.focus() }

  const button = (item, active, title, onClick) => (
    <button key={item.label} type="button" className="bub-btn" aria-label={item.label} aria-pressed={active} title={title} onMouseDown={stop} onClick={onClick}>
      <Icon name={item.icon} />
    </button>
  )

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: 'top', offset: 10, flip: true, shift: { padding: 8 }, onHide: () => setLinking(false) }}
      shouldShow={({ editor: ed, from, to }) => from !== to && !ed.isActive('figure')}
    >
      {linking ? (
        <form className="pop bub bub-link" onSubmit={(e) => { e.preventDefault(); apply() }}>
          <input value={href} onChange={(e) => setHref(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); cancel() } }} placeholder="Paste or type a link" aria-label="Link address" autoFocus />
          <button type="submit" className="bub-text" onMouseDown={stop}>{state.link ? 'Update' : 'Add'}</button>
          {state.link && <button type="button" className="bub-text is-quiet" onMouseDown={stop} onClick={() => { editor.chain().focus().extendMarkRange('link').unsetLink().run(); setLinking(false) }}>Remove</button>}
        </form>
      ) : (
        <div className="pop bub" role="toolbar" aria-label="Format selection">
          {MARKS.map((m) => button(m, state[m.icon], hint(m.label, m.key), () => m.run(editor)))}
          {button({ icon: 'link', label: 'Link' }, state.link, hint('Link', 'K'), openLink)}
          <span className="bub-sep" aria-hidden="true" />
          {BLOCKS.map((b) => button(b, state[b.icon], b.label, () => b.run(editor)))}
        </div>
      )}
    </BubbleMenu>
  )
}
