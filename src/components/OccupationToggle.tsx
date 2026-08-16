import type { OccupationStatus } from '../types'

export default function OccupationToggle({
  value,
  onChange,
}: {
  value: OccupationStatus
  onChange: (status: OccupationStatus) => void
}) {
  return (
    <div className="segmented" style={{ marginBottom: 10 }}>
      <button
        type="button"
        className={`segmented-item${value === 'working' ? ' active' : ''}`}
        onClick={() => onChange('working')}
      >
        Working
      </button>
      <button
        type="button"
        className={`segmented-item${value === 'studying' ? ' active' : ''}`}
        onClick={() => onChange('studying')}
      >
        Studying
      </button>
    </div>
  )
}
