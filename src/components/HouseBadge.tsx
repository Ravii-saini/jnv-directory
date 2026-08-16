import type { House } from '../types'
import { houseColor } from '../lib/houseColors'

export default function HouseBadge({ house }: { house: House }) {
  const color = houseColor(house)
  return (
    <span
      className="badge"
      style={{
        background: `color-mix(in srgb, ${color} 18%, transparent)`,
        color,
        fontWeight: 700,
      }}
    >
      {house}
    </span>
  )
}
