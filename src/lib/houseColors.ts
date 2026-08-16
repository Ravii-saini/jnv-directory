import type { House } from '../types'

/** JNV Alwar house colors, defined as CSS custom properties (see theme.css)
 * so they adapt automatically between light and dark mode. */
export function houseColor(house: House): string {
  return `var(--house-${house.toLowerCase()})`
}
