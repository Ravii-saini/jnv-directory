import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './config'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function uploadProfilePhoto(uid: string, file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Please choose a JPG, PNG, or WEBP image.')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image must be under 5MB.')
  }
  const photoRef = ref(storage, `profile-photos/${uid}`)
  await uploadBytes(photoRef, file, { contentType: file.type })
  return getDownloadURL(photoRef)
}
