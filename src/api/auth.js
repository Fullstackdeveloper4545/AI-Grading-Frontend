export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const parseJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1]
    if (!payload) {
      return null
    }
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

export const isTokenExpired = (token, skewSeconds = 30) => {
  const payload = parseJwtPayload(token)
  if (!payload?.exp) {
    return true
  }
  return Date.now() / 1000 >= payload.exp - skewSeconds
}

export const refreshAuthTokens = async () => {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
    return { ok: false, error: 'Missing refresh token.' }
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { ok: false, error: data?.detail || 'Refresh failed.' }
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

  return { ok: true, data }
}
