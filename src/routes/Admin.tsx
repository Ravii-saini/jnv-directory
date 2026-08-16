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
      </div>
      <div className="screen-content" style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            className={tab === 'pending' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            onClick={() => setTab('pending')}
            style={{ flex: 1 }}
          >
            Pending ({pending.length})
          </button>
          <button
            className={tab === 'members' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            onClick={() => setTab('members')}
            style={{ flex: 1 }}
          >
            Members ({activeMembers.length})
          </button>
          <button
            className={tab === 'links' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            onClick={() => setTab('links')}
            style={{ flex: 1 }}
          >
            Links
          </button>
        </div>

        {tab === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.length === 0 && <p className="muted">No pending requests.</p>}
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
                <div className="faint" style={{ marginBottom: 12 }}>
                  IG: {m.instagram} · Phone: {m.phone}
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
                  <div style={{ fontWeight: 700 }}>{m.name}</div>
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
        {saving ? <span className="spinner" /> : saved ? 'Saved ✓' : 'Save links'}
      </button>
    </div>
  )
}
