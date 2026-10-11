import SectionHead from '../../ui/SectionHead'
import { leadWriting, supportWritings, writings } from '../../lib/writings'
import WritingItem from './WritingItem'
import WritingLead from './WritingLead'

/* Homepage Writings: one featured piece, a few quieter companions, one clear door to the rest. */
export default function WritingsPreview() {
  return (
    <section className="section section-writings" aria-labelledby="writings-title">
      <div className="wrap">
        <SectionHead id="writings-title" title="Writings" count={writings.length} href="#/writings" more={`All ${writings.length} writings`} vt="writings-title" />
        <div className="wr-layout">
          {leadWriting && <WritingLead writing={leadWriting} />}
          <ul className="wr-list" role="list">
            {supportWritings.map((w) => <li key={w.slug}><WritingItem writing={w} /></li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}
