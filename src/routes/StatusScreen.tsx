import { useAuth } from '../contexts/AuthContext'

const CONTENT: Record<string, { icon: string; title: string; body: string; badge: 'warning' | 'danger' }> = {
  pending: {
    icon: '⏳',
    title: 'Waiting for admin approval',
    body: "You'll get a notification as soon as you're approved. This is usually quick, but can take a bit longer right after launch.",
    badge: 'warning',
  },
  rejected: {
    icon: '✕',
    title: "Your request wasn't approved",
    body: 'If you think this is a mistake, reach out to the admin directly.',
    badge: 'danger',
  },
  removed: {
    icon: '⚠',
    title: 'Your access has been removed',
    body: 'An admin has removed your access to the directory. Reach out to the admin if you have questions.',
    badge: 'danger',
  },
}

export default function StatusScreen({ kind }: { kind: 'pending' | 'rejected' | 'removed' }) {
  const { signOut } = useAuth()
  const { icon, title, body, badge } = CONTENT[kind]

  return (
    <div className="screen-centered" style={{ textAlign: 'center' }}>
      <div
        style={{
          width: 72,
          height: 72,
          margin: '0 auto 20px',
          borderRadius: '50%',
          background: `var(--${badge}-soft)`,
          color: `var(--${badge})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
        }}
      >
        {icon}
      </div>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{title}</h1>
      <p className="muted" style={{ fontSize: 14, marginBottom: 28 }}>
        {body}
      </p>
      <button className="btn btn-secondary" onClick={() => signOut()}>
        Sign out
      </button>
    </div>
  )
}
