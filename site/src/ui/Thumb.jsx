import { useState } from 'react'

/* Image in a reserved box: no layout shift while loading, and a quiet tone block if the image fails. */
export default function Thumb({ src, ratio = '3 / 2', priority = false, className = '' }) {
  const [failed, setFailed] = useState(false)

  return (
    <span className={`thumb ${className}`} style={{ '--ratio': ratio }}>
      {!failed && (
        <img
          src={src}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}
