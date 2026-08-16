import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import type { Profile, ViewerContext } from '../types'
import { canSeeField } from '../types'

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
      <Avatar name={member.name} photoUrl={showPhoto ? member.photoUrl : undefined} size={52} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {member.name}
        </div>
        <div className="faint" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {member.city}
          {member.job ? ` · ${member.job}` : ''}
        </div>
      </div>
      <span className="faint" aria-hidden>
        →
      </span>
    </Link>
  )
}
