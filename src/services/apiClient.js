import { clearStoredSession, getStoredSession } from './sessionStore'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'NETWORK_ERROR', details = [] } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

function notifyUnauthorized() {
  clearStoredSession()
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('collabboard:unauthorized'))
}

export async function apiRequest(path, { method = 'GET', body, query, headers = {} } = {}) {
  const url = new URL(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`)
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
  })

  const token = getStoredSession({ requireToken: true })?.token
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).catch(() => { throw new ApiError('Unable to reach the CollabBoard API.') })

  if (response.status === 204) return undefined
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status === 401) notifyUnauthorized()
    const error = payload?.error || {}
    throw new ApiError(error.message || `Request failed with status ${response.status}.`, {
      status: response.status,
      code: error.code || 'API_ERROR',
      details: error.details || [],
    })
  }
  return payload
}
