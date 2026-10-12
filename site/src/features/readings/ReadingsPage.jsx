import PageHead from '../../ui/PageHead'
import { books } from '../../lib/books'
import ArchiveGrid from './collection/ArchiveGrid'
import FocusLayer from './focus/FocusLayer'
import { useFocus } from './focus/focusStore'

/* The complete shelf. Selecting a book opens the same focused view, in place — scroll position and grid stay exactly as they were. */
export default function ReadingsPage() {
  const focused = !!useFocus().slug

  return (
    <>
      <PageHead title="Readings" count={books.length} vt="readings-title" />
      <section className="wrap archive" aria-label="All books">
        <ArchiveGrid inert={focused} />
      </section>
      <FocusLayer />
    </>
  )
}
