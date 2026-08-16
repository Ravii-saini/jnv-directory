import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { subscribeApprovedMembers } from '../firebase/profiles'
import MemberCard from '../components/MemberCard'
import BottomNav from '../components/BottomNav'
import WhatsAppButtons from '../components/WhatsAppButtons'
import type { Profile, ViewerContext } from '../types'
import { ACTIVE_BATCH } from '../types'

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function EmptyIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="8.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.5 14c2.5.2 4.5 2 4.5 4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function Directory() {
  const { profile } = useAuth()
  const [members, setMembers] = useState<Profile[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    return subscribeApprovedMembers(ACTIVE_BATCH, setMembers)
  }, [])

  const ctx: ViewerContext = {
    viewerBatch: profile?.batch ?? ACTIVE_BATCH,
    isSelf: false,
    isAdmin: profile?.isAdmin ?? false,
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const others = members.filter((m) => m.uid !== profile?.uid)
    if (!q) return others
    return others.filter(
      (m) => m.name.toLowerCase().includes(q) || m.city.toLowerCase().includes(q),
    )
  }, [members, search, profile])

  return (
    <div className="screen">
      <div className="topbar">
        <h1>Batch {ACTIVE_BATCH}</h1>
        <span className="badge badge-neutral">{members.length} members</span>
      </div>
      <div className="screen-content" style={{ paddingBottom: 24 }}>
        <div className="field" style={{ marginBottom: 16 }}>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-faint)',
                pointerEvents: 'none',
                display: 'flex',
              }}
            >
              <SearchIcon />
            </span>
            <input
              className="input"
              style={{ paddingLeft: 40 }}
              placeholder="Search by name or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <WhatsAppButtons />
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-faint)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <EmptyIcon />
            </div>
            <p className="muted">{search ? 'No one matches that search.' : 'No other members yet.'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((m) => (
              <MemberCard key={m.uid} member={m} ctx={ctx} />
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
