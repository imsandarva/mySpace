import { writings } from '../../data/writings'
import WritingRow from '../shelf/WritingRow'
import ArchiveSheet from './ArchiveSheet'

export default function WritingsArchive({ entered, onClose }) {
  return (
    <ArchiveSheet title="Writings" count={writings.length} entered={entered} onClose={onClose}>
      <ul className="m-writes">
        {writings.map((piece) => <li key={piece.slug}><WritingRow {...piece} /></li>)}
      </ul>
    </ArchiveSheet>
  )
}
