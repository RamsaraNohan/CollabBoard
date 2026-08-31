import { DEMO_PASSWORD } from '../../data/constants'
import { mockRepository } from '../mockRepository'
import { clearStoredSession, getStoredSession, storeSession } from '../sessionStore'

export const mockAuthAdapter = {
  async getSession() {
    return getStoredSession()
  },

  async login({ email, password, rememberMe = false }) {
    const workspace = await mockRepository.read()
    const user = workspace.users.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase())
    if (!user || password !== DEMO_PASSWORD) throw new Error('Email or development password is incorrect.')
    return storeSession({ userId: user.id, token: 'mock-session-token', isAuthenticated: true, rememberMe })
  },

  async register({ name, email, studentId, rememberMe = false }) {
    const workspace = await mockRepository.read()
    if (workspace.users.some((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase())) throw new Error('An account with this email already exists.')
    const now = new Date().toISOString()
    const user = {
      id: `u${Date.now()}`, studentId: studentId?.trim() || null, name: name.trim(),
      initials: name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
      email: email.trim(), avatarUrl: null, role: 'Workspace Member', createdAt: now, updatedAt: now,
    }
    await mockRepository.write((current) => ({ ...current, users: [...current.users, user] }))
    const session = storeSession({ userId: user.id, token: 'mock-session-token', isAuthenticated: true, rememberMe })
    return { user, session }
  },

  async logout() {
    clearStoredSession()
  },
}
