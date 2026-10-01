import { writings } from '../../data/writings'
import { WRITING_PREVIEW } from '../arrange'
import ShelfHead from './ShelfHead'
import WritingRow from './WritingRow'

export default function WritingsShelf({ onOpen }) {
  const preview = writings.slice(0, WRITING_PREVIEW)
  return (
    <section className="m-shelf m-rise d1" aria-labelledby="m-writings">
      <ShelfHead id="m-writings" label="Writings" count={writings.length} showAll={writings.length > preview.length} onOpen={onOpen} />
      <ul className="m-writes">
        {preview.map((piece) => <li key={piece.slug}><WritingRow {...piece} /></li>)}
      </ul>
    </section>
  )
}
