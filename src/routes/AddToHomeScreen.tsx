import { useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { markHomeScreenPromptSeen } from '../firebase/profiles'

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: -2 }}>
      <path
        d="M12 3v12M8 7l4-4 4 4M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function detectPlatform(): 'ios' | 'android' | 'other' {
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return 'other'
}

export default function AddToHomeScreen() {
  const { user } = useAuth()
  const platform = useMemo(detectPlatform, [])

  const finish = async () => {
    if (user) await markHomeScreenPromptSeen(user.uid)
  }

  return (
    <div className="screen-centered" style={{ textAlign: 'center' }}>
      <div className="logo-frame" style={{ margin: '0 auto 20px' }}>
        <img src="/logo-navodaya.png" alt="Navodaya Vidyalaya Samiti" />
      </div>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Add this to your Home Screen</h1>
      <p className="muted" style={{ fontSize: 14, marginBottom: 24 }}>
        One quick step — this makes it feel like a real app, and it's required for notifications
        (like signup approval) to reach you on iPhone.
      </p>

      {platform === 'ios' && (
        <div className="card" style={{ textAlign: 'left', marginBottom: 20 }}>
          <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <li>
              Tap the <strong>Share</strong> icon <ShareIcon /> in Safari's toolbar
            </li>
            <li>
              Scroll down and tap <strong>"Add to Home Screen"</strong>
            </li>
            <li>
              Tap <strong>"Add"</strong> in the top-right corner
            </li>
          </ol>
        </div>
      )}

      {platform === 'android' && (
        <div className="card" style={{ textAlign: 'left', marginBottom: 20 }}>
          <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <li>
              Tap the <strong>⋮ menu</strong> in Chrome's toolbar
            </li>
            <li>
              Tap <strong>"Add to Home screen"</strong> (or accept the install prompt if you see one)
            </li>
            <li>
              Tap <strong>"Install"</strong> to confirm
            </li>
          </ol>
        </div>
      )}

      {platform === 'other' && (
        <div className="card" style={{ textAlign: 'left', marginBottom: 20 }}>
          <p style={{ fontSize: 14 }}>
            Open this page on your phone (iOS Safari or Android Chrome) to add it to your home
            screen. On desktop, look for an install icon in your browser's address bar.
          </p>
        </div>
      )}

      <button className="btn btn-primary" onClick={finish}>
        I've added it — continue
      </button>
      <button className="btn btn-ghost" style={{ marginTop: 6 }} onClick={finish}>
        Skip for now
      </button>
    </div>
  )
}
