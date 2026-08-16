import { useAuth } from '../contexts/AuthContext'

function ClockIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4.5 21 19.5H3L12 4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.7" r="0.9" fill="currentColor" />
    </svg>
  )
}

const CONTENT: Record<
  string,
  { icon: React.ReactNode; title: string; body: string; badge: 'warning' | 'danger' }
> = {
  pending: {
    icon: <ClockIcon />,
    title: 'Waiting for admin approval',
    body: "You'll get a notification as soon as you're approved. This is usually quick, but can take a bit longer right after launch.",
    badge: 'warning',
  },
  rejected: {
    icon: <XIcon />,
    title: "Your request wasn't approved",
    body: 'If you think this is a mistake, reach out to the admin directly.',
    badge: 'danger',
  },
  removed: {
    icon: <AlertIcon />,
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
