import { pinterest } from '../../data/pinterest'
import { useBoardWidth } from '../../hooks/usePinterestEmbed'
import PinEmbed from './PinEmbed'

const COPY = {
  profile: { kicker: 'Profile widget', title: 'Recent pins from the account.' },
  board: { kicker: 'Board widget', title: 'One board, up to fifty pins.' },
}

export default function PinStage({ kind }) {
  const { ref, width } = useBoardWidth()
  const href = kind === 'board' ? pinterest.board : pinterest.user
  const copy = COPY[kind]

  return (
    <section className="pin-stage" aria-labelledby="pin-title">
      <p className="pin-kicker">{copy.kicker}</p>
      <h1 id="pin-title" className="pin-title">{copy.title}</h1>
      <div className="pin-frame" ref={ref}>
        <PinEmbed kind={kind} href={href} width={width} height={560} thumb={120} />
      </div>
    </section>
  )
}
