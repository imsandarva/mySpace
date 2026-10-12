import SectionHead from '../../ui/SectionHead'
import { books } from '../../lib/books'
import Collection from './collection/Collection'
import FocusLayer from './focus/FocusLayer'
import { useFocus } from './focus/focusStore'

/* Homepage Readings: a composed handful of real 3D books and the way to the rest. Selecting one opens the focused view right here in the section. */
export default function ReadingsPreview() {
  const focused = !!useFocus().slug

  return (
    <section className="section section-readings" aria-labelledby="readings-title">
      <div className="wrap">
        <SectionHead id="readings-title" title="Readings" count={books.length} href="#/readings" more={`All ${books.length} books`} vt="readings-title" />
        <div className="rd-stage">
          <Collection inert={focused} />
          <FocusLayer inline />
        </div>
      </div>
    </section>
  )
}
