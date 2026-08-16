function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export default function Avatar({
  name,
  photoUrl,
  size = 48,
}: {
  name: string
  photoUrl?: string
  size?: number
}) {
  const ring = {
    boxShadow: `0 0 0 2px var(--bg-elevated), 0 0 0 3px var(--border-soft)`,
  }

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          ...ring,
        }}
      />
    )
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
        color: 'var(--accent-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.38,
        flexShrink: 0,
        ...ring,
      }}
    >
      {initials(name) || '?'}
    </div>
  )
}
