import { useState } from 'react'
import { ROUTES, navigateTo } from '../routes'

const initialLogin = { email: '', password: '' }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const [loginForm, setLoginForm] = useState(initialLogin)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (field, value) => {
    setMessage('')
    setErrors((prev) => ({ ...prev, [field]: '' }))
    setLoginForm((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!loginForm.email) {
      nextErrors.email = 'Email is required.'
    } else if (!emailPattern.test(loginForm.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!loginForm.password) {
      nextErrors.password = 'Password is required.'
    } else if (loginForm.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      const body = new URLSearchParams({
        username: loginForm.email,
        password: loginForm.password,
      })

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/auth/login/otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body,
        }
      )

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        const apiMessage = data?.detail || 'Login failed.'
        setMessage(apiMessage)
        return
      }

      localStorage.setItem('otp_email', loginForm.email)
      setMessage(data?.message || 'OTP sent. Redirecting to verification...')
      navigateTo(ROUTES.otp)
    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark" />
          <div>
            <h1>Login</h1>
            <p>Welcome back! Please sign in to continue.</p>
          </div>
        </div>

        <div className="auth-tabs">
          <button type="button" className="active">
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              navigateTo(ROUTES.register)
            }}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={loginForm.email}
              onChange={(event) => handleChange('email', event.target.value)}
              placeholder="you@example.com"
              className={errors.email ? 'invalid' : ''}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </label>

          <label>
            Password
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginForm.password}
                onChange={(event) =>
                  handleChange('password', event.target.value)
                }
                placeholder="Enter at least 8 characters"
                className={errors.password ? 'invalid' : ''}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M3 3l18 18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.6 10.6a3 3 0 004.2 4.2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M7.5 7.5C5 9.1 3.6 12 3.6 12s2.9 5 8.4 5c1.6 0 3-.4 4.2-1.1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M14.1 6.3c-.7-.2-1.4-.3-2.1-.3-5.5 0-8.4 6-8.4 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M2.8 12s3.1-6 9.2-6 9.2 6 9.2 6-3.1 6-9.2 6-9.2-6-9.2-6z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3.2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </label>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
          {message && <div className="form-message">{message}</div>}
        </form>
      </div>
    </div>
  )
}

export default LoginPage
