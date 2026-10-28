import { Fragment, Slice } from '@tiptap/pm/model'

const OK = /^image\/(jpeg|png|webp|gif|avif)$/

export const imageFiles = (list) => [...(list || [])].filter((file) => OK.test(file.type))

/* Rich paste keeps the words and the few marks we use. Remote images are dropped; a file on the clipboard is rehosted instead. */
export const pastedHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('script,style,meta,link,iframe,object,img').forEach((node) => node.remove())
  doc.querySelectorAll('*').forEach((el) => {
    ;[...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase()
      if (name.startsWith('on') || name === 'style' || name === 'class' || name.startsWith('data-')) el.removeAttribute(attr.name)
    })
    if (el.tagName === 'A' && !/^(https?:|mailto:)/i.test(el.getAttribute('href') || '')) el.removeAttribute('href')
  })
  return doc.body.innerHTML
}

/* A blank line is a new paragraph. A single line break is a soft break, the same as Shift+Enter. */
export const plainSlice = (text, context) => {
  const schema = context.doc.type.schema
  const blocks = text.replace(/\r\n?/g, '\n').split(/\n{2,}/).map((block) => {
    const content = []
    block.split('\n').forEach((line, i) => {
      if (i) content.push(schema.nodes.hardBreak.create())
      if (line) content.push(schema.text(line))
    })
    return schema.nodes.paragraph.create(null, content.length ? content : null)
  })
  return new Slice(Fragment.from(blocks), 0, 0)
}
