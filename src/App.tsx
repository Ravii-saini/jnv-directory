import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { registerForPush } from './firebase/messaging'
import Landing from './routes/Landing'
import Register from './routes/Register'
import StatusScreen from './routes/StatusScreen'
import ProfileSetup from './routes/ProfileSetup'
import AddToHomeScreen from './routes/AddToHomeScreen'
import Directory from './routes/Directory'
import MemberProfile from './routes/MemberProfile'
import OwnProfile from './routes/OwnProfile'
import Admin from './routes/Admin'

function Gate() {
  const { stage, user } = useAuth()

  useEffect(() => {
    if (stage === 'ready' && user) {
      registerForPush(user.uid)
    }
  }, [stage, user])

  if (stage === 'loading') {
    return (
      <div className="center-fill">
        <span className="spinner" />
      </div>
    )
  }

  if (stage === 'signed-out') {
    return (
      <Routes>
        <Route path="*" element={<Landing />} />
      </Routes>
    )
  }

  if (stage === 'needs-registration') {
    return (
      <Routes>
        <Route path="*" element={<Register />} />
      </Routes>
    )
  }

  if (stage === 'pending') {
    return (
      <Routes>
        <Route path="*" element={<StatusScreen kind="pending" />} />
      </Routes>
    )
  }

  if (stage === 'rejected') {
    return (
      <Routes>
        <Route path="*" element={<StatusScreen kind="rejected" />} />
      </Routes>
    )
  }

  if (stage === 'removed') {
    return (
      <Routes>
        <Route path="*" element={<StatusScreen kind="removed" />} />
      </Routes>
    )
  }

  if (stage === 'needs-profile-setup') {
    return (
      <Routes>
        <Route path="*" element={<ProfileSetup />} />
      </Routes>
    )
  }

  if (stage === 'needs-home-screen-prompt') {
    return (
      <Routes>
        <Route path="*" element={<AddToHomeScreen />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Directory />} />
      <Route path="/member/:uid" element={<MemberProfile />} />
      <Route path="/me" element={<OwnProfile />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </BrowserRouter>
  )
}
