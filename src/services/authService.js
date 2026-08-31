import { DEMO_PASSWORD, STORAGE_KEYS } from '../data/constants'
import { mockRepository } from './mockRepository'

const parseSession = (storage, key) => {
  try {
    return JSON.parse(storage?.getItem(key) || 'null')
  } catch {
    return null
  }
}

const clearSessions = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEYS.persistentSession)
  window.sessionStorage.removeItem(STORAGE_KEYS.temporarySession)
}

const storeSession = (session) => {
  if (typeof window === 'undefined') return
  clearSessions()
  const storage = session.rememberMe ? window.localStorage : window.sessionStorage
  const key = session.rememberMe ? STORAGE_KEYS.persistentSession : STORAGE_KEYS.temporarySession
  storage.setItem(key, JSON.stringify(session))
}

export const authService = {
  async getSession() {
    if (typeof window === 'undefined') return null
    return parseSession(window.localStorage, STORAGE_KEYS.persistentSession)
      || parseSession(window.sessionStorage, STORAGE_KEYS.temporarySession)
  },

  async login({ email, password, rememberMe = false }) {
    const workspace = await mockRepository.read()
    const user = workspace.users.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase())
    if (!user || password !== DEMO_PASSWORD) throw new Error('Email or development password is incorrect.')
    const session = { userId: user.id, isAuthenticated: true, rememberMe }
    storeSession(session)
    return session
  },

  async register({ name, email, studentId, rememberMe = false }) {
    const workspace = await mockRepository.read()
    if (workspace.users.some((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error('An account with this email already exists.')
    }
    const now = new Date().toISOString()
    const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    const user = {
      id: `u${Date.now()}`,
      studentId: studentId?.trim() || null,
      name: name.trim(),
      initials,
      email: email.trim(),
      avatarUrl: null,
      role: 'Workspace Member',
      createdAt: now,
      updatedAt: now,
    }
    await mockRepository.write((current) => ({ ...current, users: [...current.users, user] }))
    const session = { userId: user.id, isAuthenticated: true, rememberMe }
    storeSession(session)
    return { user, session }
  },

  async logout() {
    clearSessions()
  },
}
