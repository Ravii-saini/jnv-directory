import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  subscribeAllMembers,
  subscribePendingMembers,
  approveMember,
  rejectMember,
  removeMember,
} from '../firebase/profiles'
import { getAlumniWhatsAppLink, getBatchWhatsAppLink, setAlumniWhatsAppLink, setBatchWhatsAppLink } from '../firebase/appConfig'
import Avatar from '../components/Avatar'
import BottomNav from '../components/BottomNav'
import { ACTIVE_BATCH, type Profile } from '../types'
import { instagramHandle, instagramUrl } from '../lib/instagram'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InboxIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12h4l1.5 3h5L16 12h4M4 12l1.8-6.3A1 1 0 0 1 6.75 5h10.5a1 1 0 0 1 .95.7L20 12M4 12v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Admin() {
  const { profile } = useAuth()
  const [pending, setPending] = useState<Profile[]>([])
  const [all, setAll] = useState<Profile[]>([])
  const [tab, setTab] = useState<'pending' | 'members' | 'links'>('pending')
  const [busyUid, setBusyUid] = useState<string | null>(null)

  useEffect(() => subscribePendingMembers(setPending), [])
  useEffect(() => subscribeAllMembers(setAll), [])

  if (!profile?.isAdmin) {
    return (
      <div className="screen-centered" style={{ textAlign: 'center' }}>
        <p className="muted">You don't have admin access.</p>
      </div>
    )
  }

  const act = async (uid: string, fn: (uid: string) => Promise<void>) => {
    setBusyUid(uid)
    try {
      await fn(uid)
    } finally {
      setBusyUid(null)
    }
  }

  const activeMembers = all.filter((m) => m.status === 'approved')

  return (
    <div className="screen">
      <div className="topbar">
        <h1>Admin</h1>
        {pending.length > 0 && <span className="badge badge-warning">{pending.length} waiting</span>}
      </div>
      <div className="screen-content" style={{ paddingBottom: 24 }}>
        <div className="stat-row">
          <div className="stat-tile">
            <div className="stat-value">{activeMembers.length}</div>
            <div className="stat-label">Active members</div>
          </div>
          <div className="stat-tile">
            <div className="stat-value">{pending.length}</div>
            <div className="stat-label">Pending review</div>
          </div>
        </div>

        <div className="segmented">
          <button
            className={`segmented-item${tab === 'pending' ? ' active' : ''}`}
            onClick={() => setTab('pending')}
          >
            Pending ({pending.length})
          </button>
          <button
            className={`segmented-item${tab === 'members' ? ' active' : ''}`}
            onClick={() => setTab('members')}
          >
            Members ({activeMembers.length})
          </button>
          <button
            className={`segmented-item${tab === 'links' ? ' active' : ''}`}
            onClick={() => setTab('links')}
          >
            Links
          </button>
        </div>

        {tab === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-faint)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <InboxIcon />
                </div>
                <p className="muted">No pending requests.</p>
              </div>
            )}
            {pending.map((m) => (
              <div key={m.uid} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Avatar name={m.name} photoUrl={m.photoUrl} size={44} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700 }}>{m.name}</div>
                    <div className="faint">
                      {m.city} · {m.house} · {m.stream}
                    </div>
                  </div>
                </div>
                <div
                  className="faint"
                  style={{
                    marginBottom: 14,
                    background: 'var(--bg-sunken)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                  }}
                >
                  IG:{' '}
                  {m.instagram ? (
                    <a href={instagramUrl(m.instagram)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                      {instagramHandle(m.instagram)}
                    </a>
                  ) : (
                    '—'
                  )}{' '}
                  · Phone: {m.phone} · {m.email}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    disabled={busyUid === m.uid}
                    onClick={() => act(m.uid, approveMember)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ flex: 1 }}
                    disabled={busyUid === m.uid}
                    onClick={() => act(m.uid, rejectMember)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'members' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activeMembers.map((m) => (
              <div key={m.uid} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={m.name} photoUrl={m.photoUrl} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {m.name}
                    {m.isAdmin && <span className="badge badge-success">Admin</span>}
                  </div>
                  <div className="faint">{m.city}</div>
                </div>
                {!m.isAdmin && (
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={busyUid === m.uid}
                    onClick={() => {
                      if (confirm(`Remove ${m.name} from the directory? Their profile record is kept but access is deactivated.`)) {
                        act(m.uid, removeMember)
                      }
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'links' && <LinksEditor />}
      </div>
      <BottomNav />
    </div>
  )
}

function LinksEditor() {
  const [batchLink, setBatchLinkState] = useState('')
  const [alumniLink, setAlumniLinkState] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getBatchWhatsAppLink(ACTIVE_BATCH).then(setBatchLinkState)
    getAlumniWhatsAppLink().then(setAlumniLinkState)
  }, [])

  const save = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await Promise.all([
        setBatchWhatsAppLink(ACTIVE_BATCH, batchLink.trim()),
        setAlumniWhatsAppLink(alumniLink.trim()),
      ])
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <div className="field">
        <label>Batch {ACTIVE_BATCH} WhatsApp invite link</label>
        <input className="input" value={batchLink} onChange={(e) => setBatchLinkState(e.target.value)} />
      </div>
      <div className="field">
        <label>JNV Alumni (school-wide) WhatsApp invite link</label>
        <input className="input" value={alumniLink} onChange={(e) => setAlumniLinkState(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={save} disabled={saving}>
        {saving ? <span className="spinner" /> : saved ? (
          <>
            <CheckIcon /> Saved
          </>
        ) : (
          'Save links'
        )}
      </button>
    </div>
  )
}
