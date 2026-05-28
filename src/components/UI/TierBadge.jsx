import React from 'react'
import { TIER_COLORS } from '../../utils/helpers'

export default function TierBadge({ tier }) {
  const t = tier ?? 0
  const c = TIER_COLORS[t] ?? TIER_COLORS[0]
  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded text-xs font-bold"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      T{t}
    </span>
  )
}
