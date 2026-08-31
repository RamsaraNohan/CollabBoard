import { apiRequest, ApiError } from '../apiClient'
import { clearStoredSession, getStoredSession, storeSession } from '../sessionStore'

export const restAuthAdapter = {
  async getSession() {
    const stored = getStoredSession({ requireToken: true })
    if (!stored) return null
    try {
      const user = await apiRequest('/auth/me')
      return { ...stored, userId: user.id, isAuthenticated: true }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null
      throw error
    }
  },
  async login({ email, password, rememberMe = false }) {
    const { token, user } = await apiRequest('/auth/login', { method: 'POST', body: { email, password } })
    return storeSession({ userId: user.id, token, isAuthenticated: true, rememberMe })
  },
  async register({ name, email, studentId, password, rememberMe = false }) {
    const { token, user } = await apiRequest('/auth/register', { method: 'POST', body: { name, email, studentId, password } })
    const session = storeSession({ userId: user.id, token, isAuthenticated: true, rememberMe })
    return { user, session }
  },
  async logout() { clearStoredSession() },
}
