/**
 * Best-effort in-app notification. There's no server (Cloud Functions needs
 * Blaze billing) to push to a fully-closed app, so this fires from the
 * recipient's own live Firestore listener whenever their tab/PWA happens to
 * be open — foreground or background — at the moment an admin acts.
 */
export async function notifyLocally(title: string, body: string) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

  try {
    if (navigator.serviceWorker) {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.showNotification(title, { body, icon: '/icons/icon-192.png' })
        return
      }
    }
    new Notification(title, { body, icon: '/icons/icon-192.png' })
  } catch {
    // Notifications are a nicety, never worth crashing over.
  }
}
