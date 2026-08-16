import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { submitRegistration } from '../firebase/profiles'
import { HOUSES, STREAMS, type House, type Stream } from '../types'

export default function Register() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [stream, setStream] = useState<Stream | ''>('')
  const [house, setHouse] = useState<House | ''>('')
  const [city, setCity] = useState('')
  const [instagram, setInstagram] = useState('')
  const [showOptional, setShowOptional] = useState(false)
  const [job, setJob] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [college, setCollege] = useState('')
  const [bio, setBio] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = name.trim() && stream && house && city.trim() && instagram.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      await submitRegistration(user.uid, user.phoneNumber ?? '', {
        name: name.trim(),
        stream: stream as Stream,
        house: house as House,
        city: city.trim(),
        instagram: instagram.trim(),
        job: job.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
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
            <label htmlFor="city">Current city *</label>
            <input id="city" className="input" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="instagram">Instagram *</label>
            <input
              id="instagram"
              className="input"
              placeholder="@yourhandle"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              required
            />
          </div>

          {!showOptional ? (
            <button type="button" className="btn btn-ghost" onClick={() => setShowOptional(true)}>
              + Add optional details (photo comes later, job, LinkedIn, college, bio)
            </button>
          ) : (
            <>
              <div className="field">
                <label htmlFor="job">Current job / company</label>
                <input id="job" className="input" value={job} onChange={(e) => setJob(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="linkedin">LinkedIn</label>
                <input id="linkedin" className="input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
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
