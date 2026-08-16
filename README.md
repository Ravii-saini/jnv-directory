# JNV 2020 Directory

A verified, admin-approved "who's who" PWA for JNV batch 2020. See
`batch-directory-spec.md` for the full product spec.

Runs entirely on Firebase's free **Spark** plan — no billing account
required. Photo uploads are stored inline in Firestore (resized/compressed
client-side) instead of Cloud Storage, and approve/reject notifications use
a live in-app fallback instead of a Cloud Function, since both of Firebase's
usual tools for those (Storage, Functions) require the paid Blaze plan.

## Local development

```
npm install
npm run dev
```

Copy `.env.example` to `.env` and fill in your Firebase project's web config
(Project settings → General → Your apps → SDK setup and configuration).
`public/firebase-messaging-sw.js` needs the same six values pasted in by
hand — service workers can't read `.env`.

## First-time Firebase project setup

1. **Authentication → Sign-in method → enable Phone.**
2. **Firestore Database → Create database** (production mode).
3. Deploy security rules once the Firebase CLI is installed and you're
   logged in (`npx firebase-tools login`):
   ```
   npx firebase-tools deploy --only firestore:rules,firestore:indexes --project <your-project-id>
   ```
4. **Make yourself admin.** Register through the app once so your
   `profiles/{yourUid}` document exists, then open it in the Firestore
   console and manually set `status: "approved"` and `isAdmin: true`. From
   then on you can approve everyone else from inside the app's Admin tab.
5. **Deploy to Hosting:**
   ```
   npm run build
   npx firebase-tools deploy --only hosting --project <your-project-id>
   ```

## If you later upgrade to the Blaze plan

Blaze still has a generous free tier — for ~50 users this will almost
certainly stay at $0/month, but a card has to be on file. If you upgrade:

- **Cloud Storage** becomes available for real file storage. `storage.rules`
  is already written; enable Storage in the console, then
  `npx firebase-tools deploy --only storage`.
- **Real push notifications** become possible. `functions/index.js` has a
  Firestore-triggered Cloud Function ready to go — it sends a push the
  moment a profile's `status` changes to `approved` or `rejected`. It reads
  the token from `profiles/{uid}.fcmToken`, which isn't currently being
  written (see `src/firebase/messaging.ts`); wire that back up with
  `getMessaging`/`getToken` (the pieces are in git history / this file's
  comments) and deploy with
  `npx firebase-tools deploy --only functions`.

## Known limitations

- iOS users must "Add to Home Screen" for any web notifications to work at
  all — this is an iOS Safari restriction, not specific to this app.
- Without Blaze, notifications only fire while the recipient's tab/PWA is
  open (foreground or background) at the moment an admin acts — there's no
  way to wake up a fully-closed app without a server component.
- Admin approval is manual and single-person — expect some delay right
  after launch when many people sign up at once.
