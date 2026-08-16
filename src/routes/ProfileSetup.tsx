import { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { saveProfileSetup } from '../firebase/profiles'
import { uploadProfilePhoto } from '../firebase/photos'
import { VisibilityPicker } from '../components/VisibilitySelector'
import Avatar from '../components/Avatar'
import AvatarPicker from '../components/AvatarPicker'
import OccupationToggle from '../components/OccupationToggle'
import type { OccupationStatus, Visibility } from '../types'

export default function ProfileSetup() {
  const { user, profile } = useAuth()

  const [photoUrl, setPhotoUrl] = useState(profile?.photoUrl)
  const [photoVisibility, setPhotoVisibility] = useState<Visibility>(profile?.photoVisibility ?? 'batch')
  const [uploading, setUploading] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [bio, setBio] = useState(profile?.bio ?? '')
  const [bioVisibility, setBioVisibility] = useState<Visibility>(profile?.bioVisibility ?? 'batch')

  const [occupationStatus, setOccupationStatus] = useState<OccupationStatus>(profile?.occupationStatus ?? 'working')
  const [job, setJob] = useState(profile?.job ?? '')

  const [instagram, setInstagram] = useState(profile?.instagram ?? '')
  const [instagramVisibility, setInstagramVisibility] = useState<Visibility>(profile?.instagramVisibility ?? 'batch')


  const [college, setCollege] = useState(profile?.college ?? '')
  const [collegeVisibility, setCollegeVisibility] = useState<Visibility>(profile?.collegeVisibility ?? 'batch')

  const [phoneVisibility, setPhoneVisibility] = useState<Visibility>(profile?.phoneVisibility ?? 'private')
  const [emailVisibility, setEmailVisibility] = useState<Visibility>(profile?.emailVisibility ?? 'batch')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user || !profile) return null

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadProfilePhoto(user.uid, file)
      setPhotoUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await saveProfileSetup(user.uid, {
        photoUrl,
        photoVisibility: photoVisibility as 'batch' | 'anyone',
        bio: bio.trim() || undefined,
        bioVisibility: bioVisibility as 'batch' | 'anyone',
        occupationStatus: job.trim() ? occupationStatus : undefined,
        job: job.trim() || undefined,
        instagram: instagram.trim(),
        instagramVisibility: instagramVisibility as 'batch' | 'anyone',
        college: college.trim() || undefined,
        collegeVisibility: collegeVisibility as 'batch' | 'anyone',
        phoneVisibility,
        emailVisibility: emailVisibility as 'batch' | 'anyone',
      })
    } catch (err) {
      console.error(err)
      setError('Could not save. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="screen">
      <div className="topbar">
        <h1>Set up your profile</h1>
      </div>
      <div className="screen-content">
        <p className="muted" style={{ marginBottom: 24, fontSize: 14 }}>
          You're approved! Review your details and choose who can see each one. You can change
          this anytime later.
        </p>

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <Avatar name={profile.name} photoUrl={photoUrl} size={64} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading…' : 'Upload photo'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowAvatarPicker((v) => !v)}
              >
                {showAvatarPicker ? 'Hide avatars' : 'Choose an avatar'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={handlePhotoChange}
              />
            </div>
          </div>

          {showAvatarPicker && (
            <div style={{ marginBottom: 16 }}>
              <AvatarPicker value={photoUrl} onSelect={setPhotoUrl} />
            </div>
          )}

          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
            Who can see your photo?
          </label>
          <VisibilityPicker value={photoVisibility} onChange={setPhotoVisibility} />
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="field" style={{ marginBottom: 10 }}>
            <label htmlFor="bio">Short bio</label>
            <textarea id="bio" className="textarea" maxLength={200} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
            Who can see your bio?
          </label>
          <VisibilityPicker value={bioVisibility} onChange={setBioVisibility} />
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="field" style={{ marginBottom: 10 }}>
            <label htmlFor="instagram">Instagram profile link</label>
            <input
              id="instagram"
              className="input"
              type="url"
              placeholder="https://instagram.com/yourhandle"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
            <span className="hint">We'll just show your @handle, linked to this.</span>
          </div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
            Who can see your Instagram?
          </label>
          <VisibilityPicker value={instagramVisibility} onChange={setInstagramVisibility} />
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="field" style={{ marginBottom: 10 }}>
            <label htmlFor="college">College</label>
            <input id="college" className="input" value={college} onChange={(e) => setCollege(e.target.value)} />
          </div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
            Who can see your college?
          </label>
          <VisibilityPicker value={collegeVisibility} onChange={setCollegeVisibility} />
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
            Working or studying?
          </label>
          <OccupationToggle value={occupationStatus} onChange={setOccupationStatus} />
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="job">{occupationStatus === 'studying' ? 'Course' : 'Job title / company'}</label>
            <input
              id="job"
              className="input"
              placeholder={occupationStatus === 'studying' ? 'e.g. MBA at IIM Ahmedabad' : 'e.g. Software Engineer at Google'}
              value={job}
              onChange={(e) => setJob(e.target.value)}
            />
          </div>
          <span className="faint">Always visible to other verified members.</span>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <div className="faint" style={{ marginBottom: 2 }}>Email</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{profile.email}</div>
          </div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
            Who can see your email?
          </label>
          <VisibilityPicker value={emailVisibility} onChange={setEmailVisibility} />
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
            Who can see your phone number?
          </label>
          <VisibilityPicker value={phoneVisibility} onChange={setPhoneVisibility} includePrivate />
          <span className="faint">Defaults to only you. Change anytime.</span>
        </div>

        {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{error}</p>}

        <button className="btn btn-primary" onClick={handleSave} disabled={saving || uploading}>
          {saving ? <span className="spinner" /> : 'Save & continue'}
        </button>
      </div>
    </div>
  )
}
