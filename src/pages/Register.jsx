import { useState } from 'react'

const initialRegister = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function RegisterPage() {
  const [registerForm, setRegisterForm] = useState(initialRegister)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (field, value) => {
    setMessage('')
    setErrors((prev) => ({ ...prev, [field]: '' }))
    setRegisterForm((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!registerForm.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    }

    if (!registerForm.email) {
      nextErrors.email = 'Email is required.'
    } else if (!emailPattern.test(registerForm.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!registerForm.password) {
      nextErrors.password = 'Password is required.'
    } else if (registerForm.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    if (!registerForm.confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password.'
    } else if (registerForm.confirmPassword !== registerForm.password) {
      nextErrors.confirmPassword = 'Passwords do not match.'
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
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: registerForm.email,
            full_name: registerForm.fullName,
            password: registerForm.password,
          }),
        }
      )

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        const apiMessage = data?.detail || 'Registration failed.'
        setMessage(apiMessage)
        return
      }

      if (data?.access_token) {
        localStorage.setItem('access_token', data.access_token)
      }
      if (data?.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token)
      }
      if (data?.token_type) {
        localStorage.setItem('token_type', data.token_type)
      }

      setMessage('Registration complete!')
      setRegisterForm(initialRegister)
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
            <h1>Register</h1>
            <p>Create your account to start grading.</p>
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
          <button type="button" className="active">
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              value={registerForm.fullName}
              onChange={(event) =>
                handleChange('fullName', event.target.value)
              }
              placeholder="Jane Doe"
              className={errors.fullName ? 'invalid' : ''}
            />
            {errors.fullName && (
              <span className="error">{errors.fullName}</span>
            )}
          </label>

          <label>
            Email
            <input
              type="email"
              value={registerForm.email}
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
                value={registerForm.password}
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

          <label>
            Confirm Password
            <div className="password-field">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={registerForm.confirmPassword}
                onChange={(event) =>
                  handleChange('confirmPassword', event.target.value)
                }
                placeholder="Re-enter your password"
                className={errors.confirmPassword ? 'invalid' : ''}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirm((prev) => !prev)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? (
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
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </label>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
          {message && <div className="form-message">{message}</div>}
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
