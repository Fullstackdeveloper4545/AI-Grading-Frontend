import { API_BASE_URL, refreshAuthTokens } from './auth'

const buildAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
})

export const fetchCurrentUser = async () => {
  let accessToken = localStorage.getItem('access_token')
  if (!accessToken) {
    return { ok: false, error: 'Missing access token.' }
  }

  const attemptRequest = async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: buildAuthHeaders(accessToken),
    })
    const data = await response.json().catch(() => ({}))
    return { response, data }
  }

  let { response, data } = await attemptRequest()
  if (response.status === 401) {
    const refreshResult = await refreshAuthTokens()
    if (!refreshResult.ok) {
      return { ok: false, error: refreshResult.error || 'Session expired.' }
    }
    accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      return { ok: false, error: 'Missing access token.' }
    }
    ;({ response, data } = await attemptRequest())
  }

  if (!response.ok) {
    return { ok: false, error: data?.detail || 'Failed to load user.' }
  }

  return { ok: true, data }
}
