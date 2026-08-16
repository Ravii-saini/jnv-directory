import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth'
import { auth } from './config'

let verifier: RecaptchaVerifier | null = null

function getVerifier(containerId: string) {
  if (!verifier) {
    verifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' })
  }
  return verifier
}

export async function sendOtp(
  phoneE164: string,
  recaptchaContainerId: string,
): Promise<ConfirmationResult> {
  const appVerifier = getVerifier(recaptchaContainerId)
  return signInWithPhoneNumber(auth, phoneE164, appVerifier)
}

export function resetRecaptcha() {
  verifier?.clear()
  verifier = null
}
