import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { submitRegistration } from '../firebase/profiles'
import OccupationToggle from '../components/OccupationToggle'
import { HOUSES, SECTIONS, STREAMS, type House, type OccupationStatus, type Section, type Stream } from '../types'

export default function Register() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.displayName ?? '')
  const [phone, setPhone] = useState('')
  const [stream, setStream] = useState<Stream | ''>('')
  const [house, setHouse] = useState<House | ''>('')
  const [section, setSection] = useState<Section | ''>('')
  const [hometown, setHometown] = useState('')
  const [city, setCity] = useState('')
  const [instagram, setInstagram] = useState('')
  const [showOptional, setShowOptional] = useState(false)
  const [occupationStatus, setOccupationStatus] = useState<OccupationStatus>('working')
  const [job, setJob] = useState('')
  const [college, setCollege] = useState('')
  const [bio, setBio] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit =
    name.trim() &&
    phone.length === 10 &&
    stream &&
    house &&
    hometown.trim() &&
    city.trim() &&
    instagram.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      await submitRegistration(user.uid, `+91${phone}`, user.email ?? '', {
        name: name.trim(),
        stream: stream as Stream,
        house: house as House,
        section: section || undefined,
        hometown: hometown.trim(),
        city: city.trim(),
        instagram: instagram.trim(),
        occupationStatus: job.trim() ? occupationStatus : undefined,
        job: job.trim() || undefined,
        college: college.trim() || undefined,
        bio: bio.trim() || undefined,
      })
    } catch (err) {
      console.error(err)
      setError('Something went wrong submitting your request. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="screen">
      <div className="topbar">
        <h1>Join the directory</h1>
      </div>
      <div className="screen-content">
        <p className="muted" style={{ marginBottom: 24, fontSize: 14 }}>
          A few required details so the admin can verify you're batch 2020. You can add a photo,
          bio, and more later.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Full name *</label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone number *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <span
                className="input"
                style={{ width: 56, flexShrink: 0, textAlign: 'center', color: 'var(--text-muted)' }}
              >
                +91
              </span>
              <input
                id="phone"
                className="input"
                type="tel"
                inputMode="numeric"
                placeholder="98765 43210"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
              />
            </div>
            <span className="hint">Defaults to private — only you (and the admin) can see it.</span>
          </div>

          <div className="field">
            <label htmlFor="stream">12th stream *</label>
            <select id="stream" className="select" value={stream} onChange={(e) => setStream(e.target.value as Stream)} required>
              <option value="" disabled>
                Select stream
              </option>
              {STREAMS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="house">House *</label>
            <select id="house" className="select" value={house} onChange={(e) => setHouse(e.target.value as House)} required>
              <option value="" disabled>
                Select house
              </option>
              {HOUSES.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="section">Section</label>
            <select id="section" className="select" value={section} onChange={(e) => setSection(e.target.value as Section)}>
              <option value="">Not sure / skip</option>
              {SECTIONS.map((s) => (
                <option key={s} value={s}>
                  Section {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="hometown">Hometown *</label>
            <input
              id="hometown"
              className="input"
              placeholder="Where you're originally from"
              value={hometown}
              onChange={(e) => setHometown(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="city">Current city *</label>
            <input id="city" className="input" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="instagram">Instagram profile link *</label>
            <input
              id="instagram"
              className="input"
              type="url"
              placeholder="https://instagram.com/yourhandle"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              required
            />
            <span className="hint">We'll just show your @handle on your profile, linked to this.</span>
          </div>

          {!showOptional ? (
            <button type="button" className="btn btn-ghost" onClick={() => setShowOptional(true)}>
              + Add optional details (photo comes later, job, college, bio)
            </button>
          ) : (
            <>
              <div className="field">
                <label htmlFor="job">Working or studying?</label>
                <OccupationToggle value={occupationStatus} onChange={setOccupationStatus} />
                <label htmlFor="job" style={{ marginTop: 4 }}>
                  {occupationStatus === 'studying' ? 'Course' : 'Job title / company'}
                </label>
                <input
                  id="job"
                  className="input"
                  placeholder={occupationStatus === 'studying' ? 'e.g. MBA at IIM Ahmedabad' : 'e.g. Software Engineer at Google'}
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="college">College</label>
                <input id="college" className="input" value={college} onChange={(e) => setCollege(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="bio">Short bio</label>
                <textarea id="bio" className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={200} />
              </div>
            </>
          )}

          {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={!canSubmit || submitting} style={{ marginTop: 8 }}>
            {submitting ? <span className="spinner" /> : 'Submit for approval'}
          </button>
        </form>
      </div>
    </div>
  )
}
