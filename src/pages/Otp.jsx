import { useState } from 'react'

function OtpPage() {
  const [otpCode, setOtpCode] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpMessage, setOtpMessage] = useState(
    'We sent a 6-digit code to your email.'
  )

  const handleOtpSubmit = (event) => {
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
    setOtpMessage('Authentication successful!')
    setOtpCode('')
    window.location.hash = '#/dashboard'
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
          <button type="submit" className="auth-submit">
            Verify &amp; Continue
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
