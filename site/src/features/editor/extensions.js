import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import FigureView from './FigureView'

/* An image and its caption are one block. The caption is an attribute, so it round-trips through JSON without a second document. */
const Figure = Node.create({
  name: 'figure',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      src: { default: '' },
      srcset: { default: '' },
      width: { default: null },
      height: { default: null },
      alt: { default: '' },
      caption: { default: '' },
      layout: {
        default: 'column',
        parseHTML: (el) => (el.getAttribute('data-layout') === 'wide' || el.classList.contains('is-wide') ? 'wide' : null),
      },
    }
  },
  parseHTML() { return [{ tag: 'figure' }] },
  renderHTML({ HTMLAttributes: a }) {
    const wide = a.layout === 'wide'
    const img = ['img', { src: a.src, alt: a.alt || '' }]
    const attrs = { class: wide ? 'fig is-wide' : 'fig', ...(wide ? { 'data-layout': 'wide' } : {}) }
    return ['figure', attrs, ...(a.caption ? [img, ['figcaption', {}, a.caption]] : [img])]
  },
  addNodeView() { return ReactNodeViewRenderer(FigureView) },
})

export const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    underline: false,
    strike: false,
    code: false,
    codeBlock: false,
    horizontalRule: false,
    dropcursor: { color: '#2a3db3', width: 2 },
    link: {
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: { rel: 'noopener noreferrer' },
      validate: (href) => /^(https?:\/\/|mailto:)/i.test(href),
    },
  }),
  Placeholder.configure({ placeholder: 'Start writing…', emptyEditorClass: 'is-editor-empty' }),
  Figure,
]
