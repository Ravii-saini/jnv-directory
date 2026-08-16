/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js')

// NOTE: Service workers can't read Vite env vars, so these are duplicated
// from your .env file. Keep this in sync with src/firebase/config.ts.
firebase.initializeApp({
  apiKey: 'AIzaSyAGA0leGst1KYUXMw3kvodQaVZahiiSI2A',
  authDomain: 'jnv-2020-directory.firebaseapp.com',
  projectId: 'jnv-2020-directory',
  storageBucket: 'jnv-2020-directory.firebasestorage.app',
  messagingSenderId: '952518467454',
  appId: '1:952518467454:web:bf4e4529530dcdcae29d2f',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {}
  self.registration.showNotification(title ?? 'JNV 2020 Directory', {
    body: body ?? '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  })
})
