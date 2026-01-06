import { useEffect, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

function OtpPage() {
  const [otpCode, setOtpCode] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpMessage, setOtpMessage] = useState(
    'We sent a 6-digit code to your email.'
  )
  const [otpEmail, setOtpEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const storedEmail = localStorage.getItem('otp_email') || ''
    setOtpEmail(storedEmail)
  }, [])

  const handleOtpSubmit = async (event) => {
    event.preventDefault()
    setOtpError('')
    setOtpMessage('')
    if (!otpCode.trim()) {
      setOtpError('Enter the 6-digit code.')
      return
    }
    if (!/^\d{6}$/.test(otpCode)) {
      setOtpError('OTP must be exactly 6 digits.')
      return
    }

    if (!otpEmail) {
      setOtpError('Missing email. Please login again.')
      return
    }

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('token_type')

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp: otpCode }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setOtpError(data?.detail || 'Invalid credentials.')
        return
      }

      if (!data?.access_token || !data?.refresh_token) {
        setOtpError('Invalid credentials.')
        return
      }

      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      if (data?.token_type) {
        localStorage.setItem('token_type', data.token_type)
      }
      localStorage.removeItem('otp_email')

      setOtpMessage('Authentication successful!')
      setOtpCode('')
      window.location.hash = '#/dashboard'
    } catch (error) {
      setOtpError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = () => {
    setOtpError('')
    setOtpMessage('A new code has been sent to your email.')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark" />
          <div>
            <h1>Email OTP</h1>
            <p>Enter the verification code to continue.</p>
          </div>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/login'
            }}
          >
            Login
          </button>
          <button type="button" disabled>
            Register
          </button>
        </div>

        <form className="auth-form otp-form" onSubmit={handleOtpSubmit}>
          {otpEmail && (
            <div className="form-message">Sent to: {otpEmail}</div>
          )}
          <label>
            Enter OTP
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otpCode}
              onChange={(event) => setOtpCode(event.target.value)}
              placeholder="6-digit code"
              className={otpError ? 'invalid' : ''}
            />
            {otpError && <span className="error">{otpError}</span>}
          </label>
          <button
            type="submit"
            className="auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
          </button>
          <div className="otp-actions">
            <button type="button" className="link-btn" onClick={handleResend}>
              Resend code
            </button>
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                window.location.hash = '#/login'
              }}
            >
              Back to login
            </button>
          </div>
          {otpMessage && <div className="form-message">{otpMessage}</div>}
        </form>
      </div>
    </div>
  )
}

export default OtpPage
