import { useState } from 'react'
import { PRESET_AVATARS } from '../data/avatars'

export default function AvatarPicker({
  value,
  onSelect,
}: {
  value?: string
  onSelect: (url: string) => void
}) {
  const initialCategory = PRESET_AVATARS.find((a) => a.url === value)?.category ?? 'boy'
  const [category, setCategory] = useState<'boy' | 'girl'>(initialCategory)

  const shown = PRESET_AVATARS.filter((a) => a.category === category)

  return (
    <div>
      <div className="segmented" style={{ marginBottom: 12 }}>
        <button
          type="button"
          className={`segmented-item${category === 'boy' ? ' active' : ''}`}
          onClick={() => setCategory('boy')}
        >
          Boys
        </button>
        <button
          type="button"
          className={`segmented-item${category === 'girl' ? ' active' : ''}`}
          onClick={() => setCategory('girl')}
        >
          Girls
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
        }}
      >
        {shown.map((a) => {
          const selected = value === a.url
          return (
            <button
              key={a.url}
              type="button"
              onClick={() => onSelect(a.url)}
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
                src={a.url}
                alt=""
                style={{ width: '100%', aspectRatio: '1', borderRadius: '50%', display: 'block' }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
