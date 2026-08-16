const { onDocumentUpdated } = require('firebase-functions/v2/firestore')
const { initializeApp } = require('firebase-admin/app')
const { getMessaging } = require('firebase-admin/messaging')

initializeApp()

/**
 * Sends the v1 approve/reject push notifications. Firestore security rules
 * stop clients from writing `status` themselves except via the admin path,
 * so this trigger is the only place these pushes originate.
 */
exports.onProfileStatusChange = onDocumentUpdated('profiles/{uid}', async (event) => {
  const before = event.data.before.data()
  const after = event.data.after.data()
  if (before.status === after.status) return
  if (!after.fcmToken) return

  let notification
  if (after.status === 'approved') {
    notification = {
      title: "You're in!",
      body: `Welcome to the ${after.batch} Directory.`,
    }
  } else if (after.status === 'rejected') {
    notification = {
      title: 'Signup update',
      body: "Your request wasn't approved.",
    }
  } else {
    return
  }

  try {
    await getMessaging().send({ token: after.fcmToken, notification })
  } catch (err) {
    console.error('Push send failed for', event.params.uid, err)
  }
})
