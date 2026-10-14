import Arrow from '../../ui/Arrow'
import Thumb from '../../ui/Thumb'
import { outbound } from '../../lib/links'
import { splitLast } from '../../lib/text'
import WritingMeta from './WritingMeta'

/* The featured writing: its image gets real size, its title becomes the largest text in the section. */
export default function WritingLead({ writing }) {
  const [head, tail] = splitLast(writing.title)

  return (
    <a className="wr-lead" href={writing.url} {...outbound} aria-label={`${writing.title}, ${writing.date}`}>
      {writing.thumb && <Thumb src={writing.thumb} ratio="3 / 2" priority className="wr-lead-img" />}
      <span className="wr-lead-copy">
        <WritingMeta writing={writing} />
        <span className="t-feature wr-title">{head}<span className="nw">{tail}<Arrow kind="out" /></span></span>
        <span className="t-small wr-blurb">{writing.blurb}</span>
      </span>
    </a>
  )
}
