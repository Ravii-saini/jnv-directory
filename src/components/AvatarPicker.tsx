const PRESET_AVATARS = [
  'spark',
  'willow',
  'plum',
  'cove',
  'amber',
  'rosewood',
  'frost',
  'clover',
].map((name) => `/avatars/${name}.png`)

export default function AvatarPicker({
  value,
  onSelect,
}: {
  value?: string
  onSelect: (url: string) => void
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
      }}
    >
      {PRESET_AVATARS.map((url) => {
        const selected = value === url
        return (
          <button
            key={url}
            type="button"
            onClick={() => onSelect(url)}
            aria-label="Choose this avatar"
            style={{
              border: selected ? '2px solid var(--accent)' : '2px solid transparent',
              borderRadius: '50%',
              padding: 2,
              background: 'none',
              lineHeight: 0,
              boxShadow: selected ? '0 0 0 3px var(--accent-soft)' : 'none',
              transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
            }}
          >
            <img
              src={url}
              alt=""
              style={{ width: '100%', aspectRatio: '1', borderRadius: '50%', display: 'block' }}
            />
          </button>
        )
      })}
    </div>
  )
}
