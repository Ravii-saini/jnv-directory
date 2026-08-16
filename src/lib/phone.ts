/** Phones are stored as +91XXXXXXXXXX for consistency; displayed without the prefix since everyone's in India. */
export function displayPhone(phone: string): string {
  return phone.startsWith('+91') ? phone.slice(3) : phone
}
