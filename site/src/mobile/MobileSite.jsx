import ReadingsShelf from './shelf/ReadingsShelf'
import WritingsShelf from './shelf/WritingsShelf'
import MobileHeader from './header/MobileHeader'
import { useArchive } from './useArchive'

/* Phone front door. Both shelves stay on one screen; All grows a shelf into its list. */
export default function MobileSite() {
  const archive = useArchive()
  const open = archive.name

  return (
    <div className="m-stage">
      <div className="m-home">
        <div className="m-root">
          <div inert={open ? '' : undefined}>
            <MobileHeader />
          </div>
          <WritingsShelf expanded={open === 'writings'} locked={open === 'readings'} onOpen={() => archive.open('writings')} onClose={archive.close} />
          <ReadingsShelf expanded={open === 'readings'} locked={open === 'writings'} onOpen={() => archive.open('readings')} onClose={archive.close} />
        </div>
      </div>
    </div>
  )
}
