import { usePinterestEmbed } from '../../hooks/usePinterestEmbed'

/* Official embed — pinit.js paints into this anchor. */

export default function PinEmbed({ kind, href, width, height, thumb }) {
  const host = usePinterestEmbed([kind, href, width, height, thumb])
  const doAttr = kind === 'board' ? 'embedBoard' : 'embedUser'

  return (
    <a
      ref={host}
      href={href}
      data-pin-do={doAttr}
      data-pin-board-width={width}
      data-pin-scale-height={height}
      data-pin-scale-width={thumb}
    >
      Open on Pinterest
    </a>
  )
}
