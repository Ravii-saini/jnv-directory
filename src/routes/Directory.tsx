import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { subscribeApprovedMembers } from '../firebase/profiles'
import MemberCard from '../components/MemberCard'
import BottomNav from '../components/BottomNav'
import WhatsAppButtons from '../components/WhatsAppButtons'
import type { Profile, ViewerContext } from '../types'
import { ACTIVE_BATCH } from '../types'

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
          <input
            className="input"
            placeholder="Search by name or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <WhatsAppButtons />
        </div>

        {filtered.length === 0 ? (
          <p className="muted" style={{ textAlign: 'center', padding: '40px 0' }}>
            {search ? 'No one matches that search.' : 'No other members yet.'}
          </p>
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
