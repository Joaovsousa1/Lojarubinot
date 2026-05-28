import React, { useState } from 'react'
import { CATEGORY_FALLBACK } from '../../utils/helpers'

export default function ItemImage({ src, category, size = 32, alt = '' }) {
  const [error, setError] = useState(false)
  const fallback = CATEGORY_FALLBACK[category] ?? '📦'

  if (error || !src) {
    return (
      <span
        className="flex items-center justify-center text-lg select-none"
        style={{ width: size, height: size, minWidth: size }}
      >
        {fallback}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated', objectFit: 'contain', minWidth: size }}
      onError={() => setError(true)}
    />
  )
}
