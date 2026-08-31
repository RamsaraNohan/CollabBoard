import { createSeedWorkspace } from '../data/seedData'
import { STORAGE_KEYS, WORKSPACE_VERSION } from '../data/constants'

let memoryWorkspace

const clone = (value) => JSON.parse(JSON.stringify(value))

function storageAvailable() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function validWorkspace(value) {
  return value?.version === WORKSPACE_VERSION && Array.isArray(value.users) && Array.isArray(value.projects) && Array.isArray(value.tasks)
}

function persist(workspace) {
  memoryWorkspace = clone(workspace)
  if (storageAvailable()) window.localStorage.setItem(STORAGE_KEYS.workspace, JSON.stringify(workspace))
  return clone(workspace)
}

function readStored() {
  if (!storageAvailable()) return memoryWorkspace
  const raw = window.localStorage.getItem(STORAGE_KEYS.workspace)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function ensureWorkspace() {
  const stored = readStored()
  if (validWorkspace(stored)) return clone(stored)
  return persist(createSeedWorkspace())
}

export const mockRepository = {
  async read() {
    return ensureWorkspace()
  },

  async write(updater) {
    const current = ensureWorkspace()
    const next = typeof updater === 'function' ? updater(clone(current)) : updater
    return persist({ ...next, version: WORKSPACE_VERSION })
  },

  async reset() {
    return persist(createSeedWorkspace())
  },
}
