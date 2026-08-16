import { useState } from 'react'
import { signInWithGoogle } from '../firebase/googleAuth'
import { isFirebaseConfigured } from '../firebase/config'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.9 18.9 13 24 13c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-2.1 14.1-5.6l-6.5-5.5C29.6 34.7 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.3 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.9 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  )
}

export default function Landing() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setError(null)
    setLoading(true)
    try {
      await signInWithGoogle()
      // onAuthStateChanged in AuthContext takes it from here.
    } catch (err) {
      console.error(err)
      setError('Could not sign in. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="screen-centered">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 40 }}>
        <div className="brand-mark">J20</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>JNV 2020 Directory</h1>
        <p className="muted" style={{ textAlign: 'center', fontSize: 14 }}>
          Verified, admin-approved who's-who for your batch.
        </p>
      </div>

      {!isFirebaseConfigured && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'var(--warning)' }}>
          <p className="faint" style={{ color: 'var(--warning)' }}>
            Firebase isn't configured yet, so sign-in won't work until env values are added. See
            the README for setup steps.
          </p>
        </div>
      )}

      {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{error}</p>}

      <button
        className="btn btn-secondary"
        onClick={handleSignIn}
        disabled={loading}
        style={{ background: 'var(--bg-elevated)' }}
      >
        {loading ? <span className="spinner" /> : <GoogleIcon />}
        {loading ? 'Signing in…' : 'Continue with Google'}
      </button>

      <p className="faint" style={{ textAlign: 'center', marginTop: 16 }}>
        We'll ask for your name and a few batch details on the next screen.
      </p>
    </div>
  )
}
