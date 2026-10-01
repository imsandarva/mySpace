import { useEffect, useRef } from 'react'
import ReadingsArchive from './archive/ReadingsArchive'
import WritingsArchive from './archive/WritingsArchive'
import MobileHeader from './header/MobileHeader'
import ReadingsShelf from './shelf/ReadingsShelf'
import WritingsShelf from './shelf/WritingsShelf'
import { useArchive } from './useArchive'

const archives = { writings: WritingsArchive, readings: ReadingsArchive }

/* Phone front door: both worlds at once, each able to open into its own list. */
export default function MobileSite() {
  const archive = useArchive()
  const home = useRef(null)
  const Sheet = archive.name ? archives[archive.name] : null

  useEffect(() => {
    const node = home.current
    if (!node) return
    if (archive.visible) node.setAttribute('inert', '')
    else node.removeAttribute('inert')
  }, [archive.visible])

  return (
    <div className="m-stage">
      <div ref={home} className={`m-home${archive.visible ? ' is-back' : ''}${archive.entered ? ' is-covered' : ''}`} aria-hidden={archive.visible || undefined}>
        <div className="m-root">
          <MobileHeader />
          <WritingsShelf onOpen={() => archive.open('writings')} />
          <ReadingsShelf onOpen={() => archive.open('readings')} />
        </div>
      </div>
      <div className={`m-dim${archive.entered ? ' is-on' : ''}`} aria-hidden="true" />
      {Sheet && <Sheet entered={archive.entered} onClose={archive.close} />}
    </div>
  )
}
