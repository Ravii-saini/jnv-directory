import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from 'firebase/auth'
import { auth } from '../firebase/config'
import { subscribeProfile } from '../firebase/profiles'
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

  useEffect(() => {
    if (!user) return
    setProfileResolved(false)
    const unsub = subscribeProfile(user.uid, (p) => {
      setProfile(p)
      setProfileResolved(true)
    })
    return unsub
  }, [user])

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
