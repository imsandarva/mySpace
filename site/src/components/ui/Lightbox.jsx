import { createPortal } from 'react-dom'

export default function Lightbox({ item, onClose, onNext, onPrev }) {
  if (!item) return null

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.alt} onClick={onClose}>
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">×</button>
      <button type="button" className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); onPrev() }} aria-label="Previous">‹</button>
      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img src={item.full} alt={item.alt} />
        <figcaption>{item.caption}</figcaption>
      </figure>
      <button type="button" className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); onNext() }} aria-label="Next">›</button>
    </div>,
    document.body,
  )
}
