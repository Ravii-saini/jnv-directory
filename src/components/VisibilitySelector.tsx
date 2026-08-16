import type { OpenVisibility, Visibility } from '../types'

const OPEN_OPTIONS: { value: OpenVisibility; label: string; icon: string }[] = [
  { value: 'batch', label: 'Batch only', icon: '🎓' },
  { value: 'anyone', label: 'Anyone', icon: '🌐' },
]

const FULL_OPTIONS: { value: Visibility; label: string; icon: string }[] = [
  { value: 'private', label: 'Only me', icon: '🔒' },
  { value: 'batch', label: 'Batch only', icon: '🎓' },
  { value: 'anyone', label: 'Anyone', icon: '🌐' },
]

export function VisibilityPicker({
  value,
  onChange,
  includePrivate = false,
}: {
  value: Visibility
  onChange: (v: Visibility) => void
  includePrivate?: boolean
}) {
  const options = includePrivate ? FULL_OPTIONS : OPEN_OPTIONS
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={value === opt.value ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
          style={{ flex: 1 }}
        >
          <span>{opt.icon}</span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
