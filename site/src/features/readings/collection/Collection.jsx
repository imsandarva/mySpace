import { useMedia } from '../../../hooks/useMedia'
import { currentBook, railBooks } from '../../../lib/books'
import BookSlot from './BookSlot'
import { compositions } from './compositions'

/* The homepage composition: a handful of real 3D books arranged by the plan for this width — not a row, not a grid.
   The current book is the focal point; it is marked by position and scale, with one quiet line, not a badge. */
export default function Collection({ inert }) {
  const narrow = useMedia('(max-width: 719px)')
  const plan = narrow ? compositions.narrow : compositions.wide

  return (
    <ul className="collection" style={{ '--stage-h': plan.stageH }} role="list" inert={inert ? '' : undefined} aria-label="Selected books">
      {plan.slots.map((s) => {
        const book = s.pick === 'current' ? currentBook : railBooks[s.pick]
        if (!book) return null
        const style = { left: `${s.x - s.w / 2}%`, width: `${s.w}%`, bottom: `${s.y}rem` }
        const note = book.current && <span className="slot-note"><i className="dot" aria-hidden="true" />Currently reading</span>
        return <BookSlot key={book.slug} book={book} rest={{ yaw: s.yaw, pitch: s.pitch }} style={style} note={note} />
      })}
    </ul>
  )
}
