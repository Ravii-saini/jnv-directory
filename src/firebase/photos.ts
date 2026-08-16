const MAX_DIMENSION = 320
const JPEG_QUALITY = 0.72
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SOURCE_BYTES = 8 * 1024 * 1024

/**
 * Firebase Storage needs the paid Blaze plan, so photos are instead resized
 * client-side and stored as a data URL directly on the profile document.
 * Firestore caps documents at 1MiB — a 320px JPEG comfortably fits.
 */
export async function uploadProfilePhoto(_uid: string, file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Please choose a JPG, PNG, or WEBP image.')
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('Image must be under 8MB.')
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not process image.')
  ctx.drawImage(bitmap, 0, 0, width, height)

  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  if (dataUrl.length > 700_000) {
    throw new Error('Image is too detailed to store — try a simpler photo.')
  }
  return dataUrl
}
