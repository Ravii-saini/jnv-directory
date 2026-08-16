import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import { ACTIVE_BATCH, type Profile } from '../types'

const profilesCol = collection(db, 'profiles')

/** Firestore rejects `undefined` field values outright, unlike `null`. */
function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>
}

export async function getProfile(uid: string): Promise<Profile | null> {
  const snap = await getDoc(doc(profilesCol, uid))
  return snap.exists() ? (snap.data() as Profile) : null
}

export function subscribeProfile(
  uid: string,
  cb: (profile: Profile | null) => void,
): Unsubscribe {
  return onSnapshot(doc(profilesCol, uid), (snap) => {
    cb(snap.exists() ? (snap.data() as Profile) : null)
  })
}

export type RegistrationInput = Pick<
  Profile,
  'name' | 'stream' | 'house' | 'hometown' | 'city' | 'instagram'
> &
  Partial<Pick<Profile, 'photoUrl' | 'bio' | 'job' | 'occupationStatus' | 'linkedin' | 'college'>>

export async function submitRegistration(
  uid: string,
  phone: string,
  email: string,
  input: RegistrationInput,
): Promise<void> {
  const profile: Profile = {
    uid,
    phone,
    phoneVisibility: 'private',
    name: input.name,
    email,
    emailVisibility: 'batch',
    photoUrl: input.photoUrl,
    photoVisibility: 'batch',
    bio: input.bio,
    bioVisibility: 'batch',
    stream: input.stream,
    house: input.house,
    hometown: input.hometown,
    city: input.city,
    occupationStatus: input.occupationStatus,
    job: input.job,
    instagram: input.instagram,
    instagramVisibility: 'batch',
    linkedin: input.linkedin,
    college: input.college,
    collegeVisibility: 'batch',
    batch: ACTIVE_BATCH,
    status: 'pending',
    profileSetupDone: false,
    homeScreenPromptSeen: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  await setDoc(doc(profilesCol, uid), stripUndefined(profile))
}

export async function saveProfileSetup(
  uid: string,
  patch: Partial<Profile>,
): Promise<void> {
  await updateDoc(
    doc(profilesCol, uid),
    stripUndefined({
      ...patch,
      profileSetupDone: true,
      updatedAt: Date.now(),
    }),
  )
}

export async function updateProfile(
  uid: string,
  patch: Partial<Profile>,
): Promise<void> {
  await updateDoc(doc(profilesCol, uid), stripUndefined({ ...patch, updatedAt: Date.now() }))
}

export async function markHomeScreenPromptSeen(uid: string): Promise<void> {
  await updateDoc(doc(profilesCol, uid), { homeScreenPromptSeen: true })
}

export function subscribeApprovedMembers(
  batch: string,
  cb: (members: Profile[]) => void,
): Unsubscribe {
  const q = query(
    profilesCol,
    where('batch', '==', batch),
    where('status', '==', 'approved'),
  )
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as Profile))
  })
}

export function subscribePendingMembers(
  cb: (members: Profile[]) => void,
): Unsubscribe {
  const q = query(profilesCol, where('status', '==', 'pending'))
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as Profile))
  })
}

export function subscribeAllMembers(cb: (members: Profile[]) => void): Unsubscribe {
  return onSnapshot(profilesCol, (snap) => {
    cb(snap.docs.map((d) => d.data() as Profile))
  })
}

export async function approveMember(uid: string): Promise<void> {
  await updateDoc(doc(profilesCol, uid), {
    status: 'approved',
    updatedAt: Date.now(),
    _approvalServerTs: serverTimestamp(),
  })
}

export async function rejectMember(uid: string): Promise<void> {
  await updateDoc(doc(profilesCol, uid), {
    status: 'rejected',
    updatedAt: Date.now(),
  })
}

export async function removeMember(uid: string): Promise<void> {
  // Soft-remove: deactivates access, keeps the profile record.
  await updateDoc(doc(profilesCol, uid), {
    status: 'removed',
    updatedAt: Date.now(),
  })
}
