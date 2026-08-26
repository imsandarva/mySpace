import Room from '../ui/Room'
import Lightbox from '../ui/Lightbox'
import { photos } from '../../data/photos'
import { useLightbox } from '../../hooks/useLightbox'

export default function Photos() {
  const box = useLightbox(photos)

  return (
    <Room id="photos" className="room-photos" label="Seen">
      <div className="photo-grid">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={`photo-tile photo-${p.layout}`}
            onClick={() => box.open(i)}
            aria-label={p.alt}
          >
            <img src={p.src} alt={p.alt} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
          </button>
        ))}
      </div>
      <Lightbox item={box.item} onClose={box.close} onNext={box.next} onPrev={box.prev} />
    </Room>
  )
}
