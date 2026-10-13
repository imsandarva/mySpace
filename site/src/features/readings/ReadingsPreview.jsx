import SectionHead from '../../ui/SectionHead'
import { books } from '../../lib/books'
import FocusLayer from './focus/FocusLayer'
import Shelf from './Shelf'
import { useFocus } from './focus/focusStore'

/* Homepage Readings: the old shelf — current book, hand-circled "Currently", and a rail — drawn with real 3D books. */
export default function ReadingsPreview() {
  const focused = !!useFocus().slug

  return (
    <section className="section section-readings" aria-labelledby="readings-title">
      <div className="wrap">
        <SectionHead id="readings-title" title="Readings" count={books.length} href="#/readings" more={`All ${books.length} books`} vt="readings-title" />
        <div className="rd-stage">
          <Shelf inert={focused} />
          <FocusLayer inline />
        </div>
      </div>
    </section>
  )
}
