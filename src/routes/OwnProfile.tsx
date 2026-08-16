import { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { updateProfile } from '../firebase/profiles'
import { uploadProfilePhoto } from '../firebase/photos'
import { VisibilityPicker } from '../components/VisibilitySelector'
import Avatar from '../components/Avatar'
import AvatarPicker from '../components/AvatarPicker'
import BottomNav from '../components/BottomNav'
import WhatsAppButtons from '../components/WhatsAppButtons'
import { HOUSES, STREAMS, type House, type Stream, type Visibility } from '../types'
import { instagramHandle, instagramUrl } from '../lib/instagram'

export default function OwnProfile() {
  const { user, profile, signOut } = useAuth()

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: profile?.name ?? '',
    stream: (profile?.stream ?? STREAMS[0]) as Stream,
    house: (profile?.house ?? HOUSES[0]) as House,
    hometown: profile?.hometown ?? '',
    city: profile?.city ?? '',
    job: profile?.job ?? '',
    instagram: profile?.instagram ?? '',
    instagramVisibility: (profile?.instagramVisibility ?? 'batch') as Visibility,
    linkedin: profile?.linkedin ?? '',
    college: profile?.college ?? '',
    collegeVisibility: (profile?.collegeVisibility ?? 'batch') as Visibility,
    bio: profile?.bio ?? '',
    bioVisibility: (profile?.bioVisibility ?? 'batch') as Visibility,
    photoUrl: profile?.photoUrl,
    photoVisibility: (profile?.photoVisibility ?? 'batch') as Visibility,
    phoneVisibility: (profile?.phoneVisibility ?? 'private') as Visibility,
    emailVisibility: (profile?.emailVisibility ?? 'batch') as Visibility,
  })

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  if (!user || !profile) return null

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadProfilePhoto(user.uid, file)
      set('photoUrl', url)
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
      await updateProfile(user.uid, {
        name: form.name.trim(),
        stream: form.stream,
        house: form.house,
        hometown: form.hometown.trim(),
        city: form.city.trim(),
        job: form.job.trim() || undefined,
        instagram: form.instagram.trim(),
        instagramVisibility: form.instagramVisibility as 'batch' | 'anyone',
        linkedin: form.linkedin.trim() || undefined,
        college: form.college.trim() || undefined,
        collegeVisibility: form.collegeVisibility as 'batch' | 'anyone',
        bio: form.bio.trim() || undefined,
        bioVisibility: form.bioVisibility as 'batch' | 'anyone',
        photoUrl: form.photoUrl,
        photoVisibility: form.photoVisibility as 'batch' | 'anyone',
        phoneVisibility: form.phoneVisibility,
        emailVisibility: form.emailVisibility as 'batch' | 'anyone',
      })
      setEditing(false)
    } catch (err) {
      console.error(err)
      setError('Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="screen">
      <div className="topbar">
        <h1>My profile</h1>
        {!editing ? (
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
            Edit
          </button>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>
            Cancel
          </button>
        )}
      </div>

      <div className="screen-content">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <Avatar name={form.name} photoUrl={form.photoUrl} size={96} />
          {editing && (
            <>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
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
              </div>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={handlePhotoChange} />
              {showAvatarPicker && (
                <div style={{ marginTop: 14, width: '100%' }}>
                  <AvatarPicker value={form.photoUrl} onSelect={(url) => set('photoUrl', url)} />
                </div>
              )}
              <div style={{ marginTop: 10, width: '100%' }}>
                <VisibilityPicker value={form.photoVisibility} onChange={(v) => set('photoVisibility', v)} />
              </div>
            </>
          )}
        </div>

        {!editing ? (
          <>
            <div className="card" style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{profile.name}</h2>
              <p className="muted" style={{ fontSize: 14, marginBottom: 12 }}>
                {profile.city} · Batch {profile.batch}
              </p>
              {profile.bio && <p style={{ fontSize: 14 }}>{profile.bio}</p>}
            </div>
            <div className="card" style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DetailRow label="House" value={profile.house} />
              <DetailRow label="12th Stream" value={profile.stream} />
              <DetailRow label="Hometown" value={profile.hometown} />
              <DetailRow label="Job / company" value={profile.job} />
              <DetailRow label="College" value={profile.college} />
              <DetailRow
                label="Instagram"
                value={profile.instagram}
                href={profile.instagram ? instagramUrl(profile.instagram) : undefined}
                display={profile.instagram ? instagramHandle(profile.instagram) : undefined}
              />
              <DetailRow label="LinkedIn" value={profile.linkedin} />
              <DetailRow label="Email" value={profile.email} />
              <DetailRow label="Phone" value={profile.phone} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <WhatsAppButtons />
            </div>
            <button className="btn btn-danger" onClick={() => signOut()}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <div className="field">
              <label>Name</label>
              <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div className="field">
              <label>12th stream</label>
              <select className="select" value={form.stream} onChange={(e) => set('stream', e.target.value as Stream)}>
                {!STREAMS.includes(form.stream) && (
                  <option value={form.stream} disabled>
                    {form.stream} (old value — please choose one below)
                  </option>
                )}
                {STREAMS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>House</label>
              <select className="select" value={form.house} onChange={(e) => set('house', e.target.value as House)}>
                {HOUSES.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Hometown</label>
              <input className="input" value={form.hometown} onChange={(e) => set('hometown', e.target.value)} />
            </div>
            <div className="field">
              <label>Current city</label>
              <input className="input" value={form.city} onChange={(e) => set('city', e.target.value)} />
            </div>
            <div className="field">
              <label>Job / company</label>
              <input className="input" value={form.job} onChange={(e) => set('job', e.target.value)} />
            </div>

            <div className="card" style={{ marginBottom: 18 }}>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Bio</label>
                <textarea className="textarea" maxLength={200} value={form.bio} onChange={(e) => set('bio', e.target.value)} />
              </div>
              <VisibilityPicker value={form.bioVisibility} onChange={(v) => set('bioVisibility', v)} />
            </div>

            <div className="card" style={{ marginBottom: 18 }}>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Instagram profile link</label>
                <input
                  className="input"
                  type="url"
                  placeholder="https://instagram.com/yourhandle"
                  value={form.instagram}
                  onChange={(e) => set('instagram', e.target.value)}
                />
                <span className="hint">We'll just show your @handle, linked to this.</span>
              </div>
              <VisibilityPicker value={form.instagramVisibility} onChange={(v) => set('instagramVisibility', v)} />
            </div>

            <div className="field">
              <label>LinkedIn</label>
              <input className="input" value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} />
            </div>

            <div className="card" style={{ marginBottom: 18 }}>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>College</label>
                <input className="input" value={form.college} onChange={(e) => set('college', e.target.value)} />
              </div>
              <VisibilityPicker value={form.collegeVisibility} onChange={(v) => set('collegeVisibility', v)} />
            </div>

            <div className="card" style={{ marginBottom: 18 }}>
              <div style={{ marginBottom: 10 }}>
                <div className="faint" style={{ marginBottom: 2 }}>Email</div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{profile.email}</div>
              </div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                Who can see your email?
              </label>
              <VisibilityPicker value={form.emailVisibility} onChange={(v) => set('emailVisibility', v)} />
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                Who can see your phone number?
              </label>
              <VisibilityPicker value={form.phoneVisibility} onChange={(v) => set('phoneVisibility', v)} includePrivate />
            </div>

            {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{error}</p>}

            <button className="btn btn-primary" onClick={handleSave} disabled={saving || uploading}>
              {saving ? <span className="spinner" /> : 'Save changes'}
            </button>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

function DetailRow({
  label,
  value,
  href,
  display,
}: {
  label: string
  value?: string
  href?: string
  display?: string
}) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
      <span className="faint">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 14, fontWeight: 600, textAlign: 'right', color: 'var(--accent)' }}
        >
          {display ?? value}
        </a>
      ) : (
        <span style={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>{value}</span>
      )}
    </div>
  )
}
