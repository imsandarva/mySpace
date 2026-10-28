import { EditorContent, useEditor } from '@tiptap/react'
import { useRef } from 'react'
import { upload } from './api'
import BubbleBar from './BubbleBar'
import { extensions } from './extensions'
import InsertControl, { atEmptyLine } from './InsertControl'
import { MediaBase } from './media'
import { imageFiles, pastedHtml, plainSlice } from './paste'
import { emit } from './platform'

/* Keys the editor itself does not own: "/" on an empty line opens the insert menu, ⌘/Ctrl K opens the link field. */
const keys = (view, event) => {
  const mod = event.metaKey || event.ctrlKey
  if (event.key === '/' && !mod && !event.altKey && atEmptyLine(view.state) && view.state.selection.empty) { event.preventDefault(); emit('write:insert'); return true }
  if (mod && event.key.toLowerCase() === 'k' && !view.state.selection.empty) { event.preventDefault(); emit('write:link'); return true }
  return false
}

/* The writing surface. What it stores is the document; the reading page renders that same document. */
export default function Editor({ id, doc, onChange, onError, onBusy, insertRef, focusRef, onPickImage }) {
  const onChangeRef = useRef(onChange)
  const onErrorRef = useRef(onError)
  const onBusyRef = useRef(onBusy)
  const lastDoc = useRef('')
  onChangeRef.current = onChange
  onErrorRef.current = onError
  onBusyRef.current = onBusy

  const initial = useRef(doc)
  const editor = useEditor({
    extensions,
    content: initial.current,
    immediatelyRender: true,
    editorProps: {
      attributes: { class: 'prose', 'aria-label': 'Writing', spellcheck: 'true' },
      transformPastedHTML: pastedHtml,
      clipboardTextParser: plainSlice,
      /* Keep the caret clear of the sticky header and of a phone's keyboard as the page grows. */
      scrollThreshold: { top: 96, bottom: 140, left: 0, right: 0 },
      scrollMargin: { top: 96, bottom: 160, left: 0, right: 0 },
      handleKeyDown: keys,
      handlePaste: (_view, event) => {
        const files = imageFiles(event.clipboardData?.files)
        if (!files.length) return false
        event.preventDefault()
        insertRef.current?.(files)
        return true
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false
        const files = imageFiles(event.dataTransfer?.files)
        if (!files.length) return false
        event.preventDefault()
        insertRef.current?.(files)
        return true
      },
    },
    onUpdate: ({ editor: current }) => {
      const json = current.getJSON()
      const key = JSON.stringify(json)
      if (key === lastDoc.current) return
      lastDoc.current = key
      onChangeRef.current(json)
    },
  }, [id])

  if (focusRef) focusRef.current = () => editor?.commands.focus('start')
  if (insertRef && editor) {
    /* Images are added one at a time, in order, at the caret. A failed one is reported and the rest carry on. */
    insertRef.current = async (files) => {
      onBusyRef.current?.(true)
      for (const file of files) {
        try {
          const attrs = await upload(id, file, 'figure')
          editor.chain().focus().insertContent({ type: 'figure', attrs }).run()
        } catch (err) { onErrorRef.current?.(err.message) }
      }
      onBusyRef.current?.(false)
    }
  }

  if (!editor) return null

  return (
    <MediaBase.Provider value={`/media/draft/${id}/`}>
      <BubbleBar editor={editor} />
      <InsertControl editor={editor} onPickImage={onPickImage} />
      <EditorContent editor={editor} />
    </MediaBase.Provider>
  )
}
