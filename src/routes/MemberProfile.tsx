import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getProfile } from '../firebase/profiles'
import Avatar from '../components/Avatar'
import type { Profile, ViewerContext } from '../types'
import { canSeeField, occupationLabel } from '../types'
import { instagramHandle, instagramUrl } from '../lib/instagram'

function Row({
  label,
  value,
  href,
  display,
}: {
  label: string
  value?: string
  href?: string
  display?: string
}) {
  if (!value) return null
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="faint" style={{ marginBottom: 2 }}>
        {label}
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)' }}
        >
          {display ?? value}
        </a>
      ) : (
        <div style={{ fontSize: 15, fontWeight: 500 }}>{value}</div>
      )}
    </div>
  )
}

export default function MemberProfile() {
  const { uid } = useParams<{ uid: string }>()
  const { profile: viewerProfile } = useAuth()
  const navigate = useNavigate()
  const [member, setMember] = useState<Profile | null | undefined>(undefined)

  useEffect(() => {
    if (!uid) return
    getProfile(uid).then(setMember)
  }, [uid])

  if (member === undefined) {
    return (
      <div className="center-fill">
        <span className="spinner" />
      </div>
    )
  }

  if (!member || member.status !== 'approved') {
    return (
      <div className="screen-centered" style={{ textAlign: 'center' }}>
        <p className="muted">This profile isn't available.</p>
        <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
          Back to directory
        </button>
      </div>
    )
  }

  const ctx: ViewerContext = {
    viewerBatch: viewerProfile?.batch ?? member.batch,
    isSelf: viewerProfile?.uid === member.uid,
    isAdmin: viewerProfile?.isAdmin ?? false,
  }

  const showPhoto = canSeeField(member.photoVisibility, member, ctx)
  const showBio = canSeeField(member.bioVisibility, member, ctx)
  const showInstagram = canSeeField(member.instagramVisibility, member, ctx)
  const showCollege = canSeeField(member.collegeVisibility, member, ctx)
  const showPhone = canSeeField(member.phoneVisibility, member, ctx)
  const showEmail = canSeeField(member.emailVisibility, member, ctx)

  return (
    <div className="screen">
      <div className="topbar">
        <button className="btn-ghost btn btn-sm" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <div className="screen-content">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 24 }}>
          <Avatar name={member.name} photoUrl={showPhoto ? member.photoUrl : undefined} size={96} />
          <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 14 }}>{member.name}</h1>
          <p className="muted" style={{ fontSize: 14, marginTop: 2 }}>
            {member.city}
          </p>
          {showBio && member.bio && <p style={{ marginTop: 12, fontSize: 14 }}>{member.bio}</p>}
        </div>

        <div className="card">
          <Row label="House" value={member.house} />
          <Row label="12th Stream" value={member.stream} />
          <Row label="Hometown" value={member.hometown} />
          <Row label={occupationLabel(member.occupationStatus)} value={member.job} />
          {showCollege && <Row label="College" value={member.college} />}
          {showInstagram && member.instagram && (
            <Row
              label="Instagram"
              value={member.instagram}
              href={instagramUrl(member.instagram)}
              display={instagramHandle(member.instagram)}
            />
          )}
          <Row label="LinkedIn" value={member.linkedin} />
          {showEmail && <Row label="Email" value={member.email} />}
          {showPhone && <Row label="Phone" value={member.phone} />}
          <Row label="Batch" value={member.batch} />
        </div>
      </div>
    </div>
  )
}
