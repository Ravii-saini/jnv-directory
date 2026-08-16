import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { subscribeApprovedMembers } from '../firebase/profiles'
import MemberCard from '../components/MemberCard'
import BottomNav from '../components/BottomNav'
import type { House, Profile, Section, ViewerContext } from '../types'
import { ACTIVE_BATCH, HOUSES, SECTIONS } from '../types'
import { houseColor } from '../lib/houseColors'

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
  const [houseFilter, setHouseFilter] = useState<House | null>(null)
  const [sectionFilter, setSectionFilter] = useState<Section | null>(null)

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
    let others = members.filter((m) => m.uid !== profile?.uid)
    if (houseFilter) others = others.filter((m) => m.house === houseFilter)
    if (sectionFilter) others = others.filter((m) => m.section === sectionFilter)
    if (!q) return others
    return others.filter(
      (m) => m.name.toLowerCase().includes(q) || m.city.toLowerCase().includes(q),
    )
  }, [members, search, houseFilter, sectionFilter, profile])

  const houseCounts = useMemo(() => {
    const counts: Record<House, number> = { Aravali: 0, Nilgiri: 0, Shivalik: 0, Udaigiri: 0 }
    for (const m of members) counts[m.house]++
    return counts
  }, [members])

  return (
    <div className="screen">
      <div className="topbar">
        <h1 className="gradient-text">Batch {ACTIVE_BATCH}</h1>
        <span className="badge badge-neutral">{members.length} members</span>
      </div>
      <div className="screen-content has-bottom-nav">
        <div className="house-cup" style={{ marginBottom: 10 }}>
          {HOUSES.map((h) => (
            <button
              key={h}
              type="button"
              className={`house-tile${houseFilter === h ? ' active' : ''}`}
              style={{ '--house-c': houseColor(h) } as CSSProperties}
              onClick={() => setHouseFilter((cur) => (cur === h ? null : h))}
              aria-pressed={houseFilter === h}
            >
              <div className="house-tile-count">{houseCounts[h]}</div>
              <div className="house-tile-label">{h}</div>
            </button>
          ))}
        </div>

        {houseFilter && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: 8, paddingLeft: 4 }}
            onClick={() => setHouseFilter(null)}
          >
            Showing {houseFilter} only ✕
          </button>
        )}

        <div className="segmented" style={{ marginBottom: 16 }}>
          <button
            type="button"
            className={`segmented-item${sectionFilter === null ? ' active' : ''}`}
            onClick={() => setSectionFilter(null)}
          >
            All sections
          </button>
          {SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className={`segmented-item${sectionFilter === s ? ' active' : ''}`}
              onClick={() => setSectionFilter((cur) => (cur === s ? null : s))}
            >
              Section {s}
            </button>
          ))}
        </div>

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

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-faint)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <EmptyIcon />
            </div>
            <p className="muted">
              {search
                ? 'No one matches that search.'
                : houseFilter || sectionFilter
                  ? `No other ${[houseFilter, sectionFilter && `Section ${sectionFilter}`].filter(Boolean).join(' · ')} members yet.`
                  : 'No other members yet.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((m, i) => (
              <div key={m.uid} className="stagger-item" style={{ '--i': i } as CSSProperties}>
                <MemberCard member={m} ctx={ctx} />
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
