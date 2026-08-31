import { STORAGE_KEYS } from '../data/constants'

function parse(storage, key) {
  try {
    return JSON.parse(storage?.getItem(key) || 'null')
  } catch {
    return null
  }
}

export function clearStoredSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEYS.persistentSession)
  window.sessionStorage.removeItem(STORAGE_KEYS.temporarySession)
}

export function getStoredSession({ requireToken = false } = {}) {
  if (typeof window === 'undefined') return null
  const session = parse(window.localStorage, STORAGE_KEYS.persistentSession)
    || parse(window.sessionStorage, STORAGE_KEYS.temporarySession)
  if (!session?.isAuthenticated || !session.userId || (requireToken && !session.token)) {
    if (session) clearStoredSession()
    return null
  }
  return session
}

export function storeSession(session) {
  if (typeof window === 'undefined') return session
  clearStoredSession()
  const storage = session.rememberMe ? window.localStorage : window.sessionStorage
  const key = session.rememberMe ? STORAGE_KEYS.persistentSession : STORAGE_KEYS.temporarySession
  storage.setItem(key, JSON.stringify(session))
  return session
}
