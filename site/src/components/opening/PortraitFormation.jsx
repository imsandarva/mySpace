import { usePortraitFormation } from '../../hooks/usePortraitFormation'

export default function PortraitFormation({ src, alt }) {
  const { phase, canvasRef, slotRef, imgRef } = usePortraitFormation(src)
  const live = phase === 'forming' || phase === 'holding'
  const shown = phase === 'holding' || phase === 'settling' || phase === 'done'

  return (
    <>
      {live && (
        <div className="formation-layer" aria-hidden>
          <canvas ref={canvasRef} />
        </div>
      )}
      <div ref={slotRef} className="portrait-slot">
        <img
          ref={imgRef}
          className={`portrait-img${shown ? ' is-on' : ''}`}
          src={src}
          alt={alt}
          width={800}
          height={1200}
          decoding="async"
        />
      </div>
    </>
  )
}
