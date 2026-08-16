/**
 * Requests OS notification permission so the local-notification fallback in
 * AuthContext can fire. (Real server-sent push via FCM needs a Cloud
 * Function, which needs the paid Blaze plan — see localNotify.ts.)
 */
export async function registerForPush(): Promise<void> {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'default') return
  try {
    await Notification.requestPermission()
  } catch {
    // Never block the app on this.
  }
}
