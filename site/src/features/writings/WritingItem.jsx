import Arrow from '../../ui/Arrow'
import Thumb from '../../ui/Thumb'
import { outbound } from '../../lib/links'
import { splitLast } from '../../lib/text'
import WritingMeta from './WritingMeta'

/* One writing as a typographic row. The title leads; the image, when there is one, is a small companion on the right.
   Used by both the homepage list and the archive (`large`), so the two stay visibly the same family. */
export default function WritingItem({ writing, large = false }) {
  const [head, tail] = splitLast(writing.title)

  return (
    <a className={`wr-item${large ? ' is-large' : ''}`} href={writing.url} {...outbound} aria-label={`${writing.title}, ${writing.date}, on Substack`}>
      <span className="wr-item-copy">
        <WritingMeta writing={writing} short={large} />
        <span className={`wr-title ${large ? 't-title' : 't-title-s'}`}>{head}<span className="nw">{tail}<Arrow kind="out" /></span></span>
        <span className="wr-blurb">{writing.blurb}</span>
      </span>
      {writing.thumb && <Thumb src={writing.thumb} ratio="4 / 5" className="wr-item-img" />}
    </a>
  )
}
