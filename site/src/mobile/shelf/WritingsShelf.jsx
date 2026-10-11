import { writings } from '../../data/writings'
import { arrangeWritings } from '../arrange'
import ShelfChrome from './ShelfChrome'
import { useRail } from './useRail'
import WritingFace from './WritingFace'

export default function WritingsShelf({ expanded, locked, onOpen, onClose }) {
  const pieces = arrangeWritings(writings)
  const rail = useRail(!expanded)

  return (
    <ShelfChrome id="writings" label="Writings" count={pieces.length} expanded={expanded} locked={locked} onOpen={onOpen} onClose={onClose}>
      <div className={expanded ? undefined : 'm-bleed'}>
        <ul ref={rail.ref} className={expanded ? 'm-stack' : 'm-rail m-rail-cards'} onKeyDown={rail.onKeyDown}>
          {pieces.map((piece, index) => <WritingFace key={piece.slug} piece={piece} index={index} expanded={expanded} />)}
        </ul>
      </div>
    </ShelfChrome>
  )
}
