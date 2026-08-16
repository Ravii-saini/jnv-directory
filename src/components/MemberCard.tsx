import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import type { Profile, ViewerContext } from '../types'
import { canSeeField } from '../types'
import { houseColor } from '../lib/houseColors'

export default function MemberCard({
  member,
  ctx,
}: {
  member: Profile
  ctx: ViewerContext
}) {
  const showPhoto = canSeeField(member.photoVisibility, member, ctx)

  return (
    <Link
      to={`/member/${member.uid}`}
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        textDecoration: 'none',
        color: 'var(--text)',
      }}
    >
      <Avatar
        name={member.name}
        photoUrl={showPhoto ? member.photoUrl : undefined}
        size={52}
        ringColor={houseColor(member.house)}
      />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {member.name}
        </div>
        <div className="faint" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {member.city}
          {member.job ? ` · ${member.job}` : ''}
        </div>
      </div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        style={{ color: 'var(--text-faint)', flexShrink: 0 }}
      >
        <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  )
}
