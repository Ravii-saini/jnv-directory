/** Pulls just the @handle out of a full Instagram URL (or a bare handle) for display. */
export function instagramHandle(input: string): string {
  const trimmed = input.trim()
  const match = trimmed.match(/instagram\.com\/([^/?#]+)/i)
  const raw = match ? match[1] : trimmed.replace(/^@/, '')
  return `@${raw.replace(/^@/, '')}`
}

/** Normalizes a handle or partial/full URL into a real clickable Instagram link. */
export function instagramUrl(input: string): string {
  const trimmed = input.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (/instagram\.com/i.test(trimmed)) return `https://${trimmed}`
  return `https://instagram.com/${trimmed.replace(/^@/, '')}`
}
