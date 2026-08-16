import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from 'firebase/auth'
import { auth } from '../firebase/config'
import { subscribeProfile, updateProfile } from '../firebase/profiles'
import { notifyLocally } from '../lib/localNotify'
import type { Profile } from '../types'

export type AppStage =
  | 'loading'
  | 'signed-out'
  | 'needs-registration'
  | 'pending'
  | 'rejected'
  | 'removed'
  | 'needs-profile-setup'
  | 'needs-home-screen-prompt'
  | 'ready'

interface AuthState {
  user: User | null
  profile: Profile | null
  stage: AppStage
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  stage: 'loading',
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [authResolved, setAuthResolved] = useState(false)
  const [profileResolved, setProfileResolved] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthResolved(true)
      if (!u) {
        setProfile(null)
        setProfileResolved(true)
      }
    })
  }, [])

  const prevStatusRef = useRef<Profile['status'] | null>(null)

  useEffect(() => {
    if (!user) return
    setProfileResolved(false)
    prevStatusRef.current = null
    const unsub = subscribeProfile(user.uid, (p) => {
      const prev = prevStatusRef.current
      if (prev === 'pending' && p?.status === 'approved') {
        notifyLocally("You're in!", `Welcome to the ${p.batch} Directory.`)
      } else if (prev === 'pending' && p?.status === 'rejected') {
        notifyLocally('Signup update', "Your request wasn't approved.")
      }
      prevStatusRef.current = p?.status ?? null
      setProfile(p)
      setProfileResolved(true)
    })
    return unsub
  }, [user])

  // Self-heal legacy profiles created before the `email` field existed.
  useEffect(() => {
    if (!user?.email || !profile) return
    if (profile.email) return
    updateProfile(user.uid, { email: user.email, emailVisibility: profile.emailVisibility ?? 'batch' }).catch(
      (err) => console.error('Failed to backfill email:', err),
    )
  }, [user, profile])

  let stage: AppStage = 'loading'
  if (authResolved && profileResolved) {
    if (!user) stage = 'signed-out'
    else if (!profile) stage = 'needs-registration'
    else if (profile.status === 'pending') stage = 'pending'
    else if (profile.status === 'rejected') stage = 'rejected'
    else if (profile.status === 'removed') stage = 'removed'
    else if (!profile.profileSetupDone) stage = 'needs-profile-setup'
    else if (!profile.homeScreenPromptSeen) stage = 'needs-home-screen-prompt'
    else stage = 'ready'
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, profile, stage, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
