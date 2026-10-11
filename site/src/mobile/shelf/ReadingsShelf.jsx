import { useEffect, useState } from 'react'
import { books } from '../../data/books'
import { arrangeBooks } from '../arrange'
import { bookKey } from './bookKey'
import BookFace from './BookFace'
import ShelfChrome from './ShelfChrome'
import SpinePanel from './SpinePanel'
import { useRail } from './useRail'

export default function ReadingsShelf({ expanded, locked, onOpen, onClose }) {
  const { ordered, total } = arrangeBooks(books)
  const rail = useRail(!expanded)
  const [open, setOpen] = useState(null)
  const [cursor, setCursor] = useState(0)
  const active = ordered.find((book, index) => bookKey(book.title, index) === open) ?? null

  useEffect(() => { if (expanded) setOpen(null) }, [expanded])

  const toggle = (key) => setOpen((now) => (now === key ? null : key))

  return (
    <ShelfChrome id="readings" label="Readings" count={total} expanded={expanded} locked={locked} onOpen={onOpen} onClose={onClose}>
      <div className={expanded ? undefined : 'm-bleed'}>
        <ul ref={rail.ref} className={expanded ? 'm-stack' : 'm-rail m-rail-spines'} onKeyDown={rail.onKeyDown}>
          {ordered.map((book, index) => {
            const key = bookKey(book.title, index)
            return (
              <BookFace
                key={key}
                book={book}
                index={index}
                expanded={expanded}
                open={open === key}
                tab={index === cursor ? 0 : -1}
                onToggle={(name) => { setCursor(index); toggle(name) }}
                onFocus={() => setCursor(index)}
              />
            )
          })}
        </ul>
      </div>
      {!expanded && <SpinePanel book={active} />}
    </ShelfChrome>
  )
}
