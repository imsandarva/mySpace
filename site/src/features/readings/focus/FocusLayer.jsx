import { bookBySlug } from '../../../lib/books'
import FocusSheet from './FocusSheet'
import { useEffect } from 'react'
import { focusStore, useFocus } from './focusStore'

/* Where the focused view lives. `inline` sits inside its section (homepage); otherwise it fills the viewport under the header
   (archive). Same component, same behaviour — only the placement differs. Renders nothing until a book is opened. */
export default function FocusLayer({ inline = false }) {
  const focus = useFocus()
  useEffect(() => () => focusStore.release(), []) /* leaving the page closes the book — focus never outlives its page */
  const book = focus.slug && bookBySlug(focus.slug)
  return book ? <FocusSheet key={book.slug} book={book} focus={focus} inline={inline} /> : null
}
