import { useState } from 'react'
import type { ConfirmationResult } from 'firebase/auth'
import { sendOtp, resetRecaptcha } from '../firebase/phoneAuth'
import { isFirebaseConfigured } from '../firebase/config'

const RECAPTCHA_ID = 'recaptcha-container'

export default function Landing() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const e164 = `+91${phone}`

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (phone.length !== 10) {
      setError('Enter a valid 10-digit phone number.')
      return
    }
    setLoading(true)
    try {
      const result = await sendOtp(e164, RECAPTCHA_ID)
      setConfirmation(result)
    } catch (err) {
      console.error(err)
      setError('Could not send OTP. Check the number and try again.')
      resetRecaptcha()
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmation) return
    setError(null)
    setLoading(true)
    try {
      await confirmation.confirm(otp.trim())
      // onAuthStateChanged in AuthContext takes it from here.
    } catch (err) {
      console.error(err)
      setError('Incorrect code. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen-centered">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 36 }}>
        <div className="brand-mark">J20</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>JNV 2020 Directory</h1>
        <p className="muted" style={{ textAlign: 'center', fontSize: 14 }}>
          Verified, admin-approved who's-who for your batch.
        </p>
      </div>

      {!isFirebaseConfigured && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'var(--warning)' }}>
          <p className="faint" style={{ color: 'var(--warning)' }}>
            Firebase isn't configured yet, so phone sign-in won't work until env values are
            added. See the README for setup steps.
          </p>
        </div>
      )}

      {!confirmation ? (
        <form onSubmit={handleSendOtp}>
          <div className="field">
            <label htmlFor="phone">Phone number</label>
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
                autoComplete="tel-national"
                placeholder="98765 43210"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
            <span className="hint">We'll text you a one-time code. No password needed.</span>
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading || phone.length !== 10}>
            {loading ? <span className="spinner" /> : 'Send code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <div className="field">
            <label htmlFor="otp">Enter the 6-digit code</label>
            <input
              id="otp"
              className="input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: 20 }}
            />
            <span className="hint">Sent to {e164}</span>
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading || otp.length < 6}>
            {loading ? <span className="spinner" /> : 'Verify & continue'}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginTop: 8 }}
            onClick={() => {
              setConfirmation(null)
              setOtp('')
              resetRecaptcha()
            }}
          >
            Use a different number
          </button>
        </form>
      )}

      <div id={RECAPTCHA_ID} />
    </div>
  )
}
