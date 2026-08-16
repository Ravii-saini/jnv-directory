import { getToken, getMessaging, isSupported } from 'firebase/messaging'
import { doc, updateDoc } from 'firebase/firestore'
import { app, db, isFirebaseConfigured } from './config'

export async function registerForPush(uid: string): Promise<void> {
  if (!isFirebaseConfigured) return
  if (!(await isSupported().catch(() => false))) return
  if (Notification.permission === 'denied') return

  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    const messaging = getMessaging(app)
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined
    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration })
    if (token) {
      await updateDoc(doc(db, 'profiles', uid), { fcmToken: token })
    }
  } catch (err) {
    // Push is best-effort — never block the app on it (e.g. unsupported iOS PWA context).
    console.warn('Push registration skipped:', err)
  }
}
